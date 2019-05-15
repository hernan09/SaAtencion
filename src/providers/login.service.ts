import { Config } from './../app/config';
import { Utils } from './utils';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';




@Injectable()
export class LoginService {

    activeServTel:boolean = false;

    constructor(
        private utils: Utils,
        private dataService : DataService,
        private androidPermissions: AndroidPermissions,
      ) {

      }


private checkAndRequestPermissions(permission: string){

  this.androidPermissions.hasPermission(permission).then(
    result =>{
      if(!result.hasPermission){
          console.log('Has permission?',result.hasPermission);
          this.androidPermissions.requestPermission(permission)
      }
    },
    err => this.androidPermissions.requestPermission(permission)
    );

}

// UTILS
 public login(dni) {
  console.log('LOGINSERVICE dni',dni);

  this.checkAndRequestPermissions(this.androidPermissions.PERMISSION.CAMERA);
  this.checkAndRequestPermissions(this.androidPermissions.PERMISSION.RECORD_AUDIO);

    if (!dni) throw "Cannot login: missing dni!";

    const activeUser = this.utils.getActiveUser();
    console.log("login service - login:  Active User: ",activeUser);
    if (!activeUser && this.isNewUser(dni) && this.utils.getTitular()) {
      //primero borro todo y despues agrego al usuario nuevo
      this.dataService.removeAllUsers();

      this.utils.setActiveUser(dni);
      console.log("login service - login:  New User: ",this.utils.getActiveUser())
      this.dataService.addUser(dni, true); // true = noupdate
      this.utils.setTitular(dni);
    } else {

      if (activeUser) {
        //se agrega un nuevo socio
        if (this.dataService.isTitular(activeUser) && this.isNewUser(dni)) {
          this.dataService.addUser(dni, true); // true = noupdate
        }
        this.utils.setActiveUser(dni);
      } else {
        //caso primer ingreso
        this.utils.setActiveUser(dni);

        if (this.isNewUser(dni) && !this.utils.getTitular()) {
          this.dataService.addUser(dni, true); // true = noupdate
          this.utils.setTitular(dni);
        }
      }

      let phonesLS = this.dataService.getLocalStorage(Config.KEY.TELEFONOS);
      // console.log("=> phonesLS",phonesLS);
      // console.log("=> verificando activeServTel",this.activeServTel);
      if(this.activeServTel && phonesLS != null) this.dataService.updateTelefono();
    }

    this.utils.setItem(Config.KEY.EXPIRES, this.calcExpireTime());
  }

  public isNewUser(dni) {
    const users = this.dataService.restoreUsers();
    return users.indexOf(dni) === -1;
  }

  calcExpireTime() {
    return Date.now() + Config.OPTIONS.EXPIRE_TIME * 60000;
  }

  activeServiceTel(data){
    console.log("Service tel ",data);
    this.activeServTel = data;
  }

}
