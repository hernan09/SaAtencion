import { Component } from '@angular/core';
import { Config } from './../../app/config';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { NavigatorPage } from './../navigator/navigator';
import { ViewChild } from '@angular/core';
import { DataService } from '../../providers/data.service';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SolicitudAtencionPage } from '../solicitud-atencion/solicitud-atencion';
import { AuthService } from '../../providers/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { AlertService } from '../../providers/alert.service';
import { HomePage } from '../../pages/home/home';
import { empty } from 'rxjs';
import { error } from '@angular/compiler/src/util';
/**
 * Generated class for the SaLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-location',
  templateUrl: 'sa-location.html',
})
export class SaLocationPage {

  @ViewChild(NavigatorPage) menu : NavigatorPage;

  profileForm = new FormGroup({
    location: new FormControl('', Validators.required)
  })

  title = 'Solicitud de Atención';
  location:any;
  dataForm:any;
  socio: any;
  validationLocation:string;
  selectOptions: any;
  localidades:any
  allName = [];
  backHome : boolean = false;
  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef, public navParams: NavParams, public utils: Utils,public dataservice:DataService,public authService :AuthService, public loading:LoadingController,public alertcontroler:AlertController,public alertService:AlertService) {
    //let dataPage =  this.utils.getFormSolicitudAtencion();
    //console.log("datos de esta sección 2: ", dataPage);
    //this.getLocation();
    this.getName();
    //trae el dni del login para incorporarlo en el servicio de localidades
    this.getDataLocalidad()

    this.selectOptions = {
      title: 'Localidad',
    };
  }

  ionViewWillEnter(){
    this.presentLoading();
  }

  ionViewDidLoad() {
    this.getBackData();//paso: agregar getBackData => 1
    this.menu.setArrowBack(true);
  }

  presentLoading() {
    const loader = this.loading.create({
      content: "Espere un momento por favor...",
      duration: 2000
    });
    loader.present();
  }

  getDataLocalidad(){
    let datosLC= this.dataservice.getLocalStorage(Config.KEY.MIS_DATOS)
    console.log('datoslc',datosLC.dni)

    this.dataservice.validarSA('10000080').subscribe(data=>{

      this.localidades = data.localidades;
      let defaultSelect = data.localidadDefault;
      this.validationLocation = defaultSelect;

      if(this.localidades == ""){
        //casuistica de arreglo vacio
       let message = Config.MSG.ADD_USER_ERROR_EMPTY;
       this.alertService.showAlert(Config.TITLE.WE_ARE_SORRY, message,Config.ALERT_CLASS.ERROR_CSS);
       this.navCtrl.push(HomePage)
      }
    },err=>{
      console.log('err',err)
      let message = Config.MSG.ERROR;
      this.alertService.showAlert(Config.TITLE.WARNING_TITLE, message,Config.ALERT_CLASS.ERROR_CSS);
      this.navCtrl.push(HomePage)
    })
  }

  getBackData(){
    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }
      this.validationLocation = dataPage[count-1].step2.location;//paso: cambiar variable => 2

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }
  }

  get f() { return this.profileForm.controls; }

  getLocation(){
    this.location = [ 'Córdoba', 'Rosario', 'Funes' ];
  }

  getName(){
    console.log('=>socio:',this.utils.getFormSolicitudAtencion().length)

    if(this.utils.getFormSolicitudAtencion().length){
      console.log("mas de un usuario");
      this.backHome = false;
      this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
    }else{
      console.log("un usuario");
      this.backHome = true;
      this.getNameUser()
    }
  }

  getNameUser(){
    let allUser = this.navParams.get('dni');
    let getName = this.dataservice.restoreMisDatos(allUser[0]);
    this.allName.push(getName.nombre + ' ' + getName.apellido);
    this.socio = this.allName;
    console.log("getnameUser",this.socio);
  }

  getDataContact() {
    this.gotoPage();
  }

  gotoPage(){
    // if(this.utils.getBackPage()) {
    //   this.utils.deleteDataFormSolicitudAtencion();
    //   this.cdRef.detectChanges();
    // }
    this.utils.backPage(false);//paso: agegar backpage => 4
    this.saveData();
    //this.navCtrl.push( SaConsultaPage );
    let message = Config.MSG.TIMEOUT_ERROR;
      this.alertService.showAlert(Config.TITLE.WE_ARE_SORRY, message,Config.ALERT_CLASS.ERROR_CSS);
      this.navCtrl.push(HomePage)
  }

  saveData(){
    this.dataForm = {
      "step2": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,2);
  }

  previusPage() {
    if(!this.backHome){
      this.navCtrl.setRoot( SolicitudAtencionPage );
    }else{
      this.navCtrl.setRoot( HomePage );
    }
  }

 ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
   console.log("LOCATION getBackPage",this.utils.getBackPage());
   // this.utils.backPage(true);
 }
}
