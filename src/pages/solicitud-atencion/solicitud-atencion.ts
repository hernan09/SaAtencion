import { ChangeDetectorRef } from '@angular/core';
import { NavigatorPage } from './../navigator/navigator';
import { Observable } from 'rxjs';
import { AlertService } from '../../providers/alert.service';
import { Config } from './../../app/config';
import { NetworkService } from './../../providers/network.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { SolicitudVcPage } from '../solicitud-vc/solicitud-vc';
import { SaLocationPage } from '../sa-location/sa-location'; 
import { DataService } from '../../providers/data.service';
import { HomePage } from '../home/home';
import { Utils } from '../../providers/utils';
import { ToastService } from '../../providers/toast.service';
import { ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';

/**
 * Generated class for the SolicitudAtencionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-solicitud-atencion',
  templateUrl: 'solicitud-atencion.html',
})

export class SolicitudAtencionPage {
    data:any;
    dataForm: any;
    radio: string;
    name1: string = '';
    name2: string = '';
    tycs1:boolean;
    tycs2:boolean;
    tycs3:boolean;
    tycs4:boolean;
    tycs5:boolean;
    tycs6:boolean;
    enable:boolean;
    public title ="Solicitud de Atención";
    allName = [];
    @ViewChild(NavigatorPage) menu : NavigatorPage;

    profileForm = new FormGroup({
      partner: new FormControl('', Validators.required)
    })

    constructor(
      public navCtrl: NavController,
      public utils: Utils,
      private alertService : AlertService,
      public navParams: NavParams,
      private cdRef:ChangeDetectorRef,
      public alertctrl: AlertController,
      public dataService :DataService

     ){
      // this.data = ["Incarbone Eduardo Oscar","Incarbone Maria Sol",'Julio Cesar','Infran Emiliano','Hernan Dario','Andres Lauga' ];

      let dataPage =  this.utils.getFormSolicitudAtencion();
      console.log("datos de esta sección 1: ", dataPage);

      this.getNameUser();
    }

    getNameUser(){
      if(!this.utils.getFormSolicitudAtencion().length){
        let allUser = this.navParams.get('dni');

        for (var i = 0; i < allUser.length ; i++) {
          let getName = this.dataService.restoreMisDatos(allUser[i]);
          this.allName.push(getName.nombre + ' ' + getName.apellido);
        }
        console.log('allName ',this.allName);
      }else{
        console.log("allname=>",this.utils.getFormSolicitudAtencion()[0].allName);
        this.allName = this.utils.getFormSolicitudAtencion()[0].allName;
      }
    }


    ionViewDidEnter(){
      console.log("=> DELETE",this.utils.getBackPage());
      if(this.utils.getBackPage()){

        this.enable = true;

        let dataPage =  this.utils.getFormSolicitudAtencion();
        var count = 0 ;
        for (let i = 0; i < dataPage.length; i++) {
            count = count + 1;
        }
        // if(dataPage[count-1].step1.users[0] == "Incarbone Eduardo Oscar" ){
        //   console.log("if");
        //   this.radio = dataPage[count-1].step1.users[1];
        // }else{
        //   console.log("else");
        //
        // }

        this.radio = dataPage[count-1].step1.users[0] || dataPage[count-1].step1.users[1];
        this.tycs1 = dataPage[count-1].step1.users1;
        this.tycs2 = dataPage[count-1].step1.users2;
        this.tycs3 = dataPage[count-1].step1.users3;
        this.tycs4 = dataPage[count-1].step1.users4;
        this.tycs5 = dataPage[count-1].step1.users5;
        this.tycs6 = dataPage[count-1].step1.users6;
        //se quito el historial y para que no haga push cada vez que vuelva atras
        // this.utils.deleteDataFormSolicitudAtencion();
        // this.cdRef.detectChanges();
      }
      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
      this.menu.setArrowBack(true);
    }

    btnValidate() {
      if(this.tycs1 || this.tycs2 || this.tycs3 || this.tycs4 || this.tycs5 ||this.tycs6 || (this.tycs1 && this.tycs2)){
        this.enable = true;
      } else {
        this.enable = false;
      }
    }

    async loaderLocal(){
      const alert = await this.alertctrl.create({

        message: 'Bienvenido',
        buttons: [
           {
            text: 'Continuar',
            handler: () => {
              console.log('Confirm Okay');
              this.gotoPage()
            }
          }
        ]
      });

      await alert.present();
    }

    getDataPartner() {

      // if(this.utils.getBackPage()) {
      //   this.utils.deleteDataFormSolicitudAtencion();
      //   this.cdRef.detectChanges();
      // }
      // this.dataForm = {
      //   "step1": this.profileForm.value
      // }
      console.log("pasar ala otra pagina",this.profileForm.value);

      /*if(this.profileForm.value.partner == "Incarbone Eduardo Oscar") {
        this.name1 = 'Incarbone Eduardo Oscar';
        this.tycs1 = true;
        this.tycs2 = false;
        this.tycs3 = false;
        this.tycs4 = false;
        this.tycs5 = false;
        this.tycs6 = false;
      }

      if(this.profileForm.value.partner == "Incarbone Maria Sol") {
        this.name2 = 'Incarbone Maria Sol';
        this.tycs1 = false;
        this.tycs2 = true;
        this.tycs3 = false;
        this.tycs4 = false;
        this.tycs5 = false;
        this.tycs6 = false;
      }
      if(this.profileForm.value.partner == "Julio Cesar") {
        this.name2 = 'Julio Cesar';
        this.tycs1 = false;
        this.tycs2 = false;
        this.tycs3 = true;
        this.tycs4 = false;
        this.tycs5 = false;
        this.tycs6 = false;
      }
      if(this.profileForm.value.partner == "Infran Emiliano") {
        this.name2 = 'Infran Emiliano';
        this.tycs1 = false;
        this.tycs2 = false;
        this.tycs3 = false;
        this.tycs4 = true;
        this.tycs5 = false;
        this.tycs6 = false;
      }
      if(this.profileForm.value.partner == "Hernan Dario") {
        this.name2 = 'Hernan Dario';
        this.tycs1 = false;
        this.tycs2 = false;
        this.tycs3 = false;
        this.tycs4 = false;
        this.tycs5 = true;
        this.tycs6 = false;
      }
      if(this.profileForm.value.partner == "Andres Lauga") {
        this.name2 = 'Andres Lauga';
        this.tycs1 = false;
        this.tycs2 = false;
        this.tycs3 = false;
        this.tycs4 = false;
        this.tycs5 = false;
        this.tycs6 = true;
      }*/

      let check = {
        users: [this.profileForm.value.partner],
      }

      this.dataForm = {
        "step1": check,
        "allName": this.allName
      }

      console.log("dataForm ",this.dataForm);

      this.utils.setFormSolicitudAtencion(this.dataForm,"step1");

      // let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, 'Tenemos este domicilio asociado a vos: "Emilio mitre 457". ¿Te encontras en el mismo?', Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
      // alert.onDidDismiss(res => {
      //   var location = 'Córdoba';
      //   var address = 'Emilio mitre 457';
      //   if (res != false) {
      //     //Si contesta que si al Reemplazar titular
      //     this.gotoPage(true,location,address);
      //   } else {
      //     this.gotoPage(false,undefined,undefined);
      //   }
      // });
      // alert.present();
      this.utils.backPage(false);
      this.gotoPage();
    }

    gotoPage(){

      // let showAdress = {
      //   show: data,
      //   location : location,
      //   address: address
      // }
      // this.navCtrl.push( SaLocationPage, {'showAdress' : showAdress} );
      this.navCtrl.push( SaLocationPage );
    }

    previusPage() {
      this.navCtrl.setRoot(HomePage);
    }
}
