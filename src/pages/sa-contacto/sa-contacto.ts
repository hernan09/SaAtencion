import { Utils } from './../../providers/utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SolicitudAtencionPage } from '../solicitud-atencion/solicitud-atencion';
import { NavigatorPage } from './../navigator/navigator';
import { ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Config } from './../../app/config';
import { AlertService } from './../../providers/alert.service';
/**
 * Generated class for the SaContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-contacto',
  templateUrl: 'sa-contacto.html',
})
export class SaContactoPage {

  @ViewChild(NavigatorPage) menu : NavigatorPage;
  selectOptions: any;
  location:any;
  emailList:any;
  emailShow:string;
  addressList:any;
  addressShow:string = "";
  telFinal:number;
  prefijoFinal:number;
  private prefijo : number;
  private tel: number;
  emailTitle: any;
  adressTitle:any;

  //validation input color
  validationCod:number;
  validationNum:number;
  validationAddress:string = "";
  validationLocation:string = "";
  validationEmail:string;

  profileForm = new FormGroup({
    cod: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    emailList: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    addressList: new FormControl('', Validators.required),
    direction: new FormControl('' )
  })
  title = 'Solicitud de Atención';

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils: Utils,private alertService : AlertService,) {

    this.selectOptions = {
      title: 'Localidad',
    };
    this.emailTitle = {
      title: 'Email',
    };
    this.adressTitle = {
      title: 'Dirección',
    };

    this.getEmail();
    this.getAddress();
    this.getLocation();
  }

  get f() { return this.profileForm.controls; }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getDataContact() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  previusPage() {
    this.navCtrl.setRoot( SolicitudAtencionPage );
  }

  gotoPage(){

    if(!this.checkTelLength()){
        this.alertService.showAlert(Config.TITLE.WRONG_NUMBER, Config.MSG.WRONG_NUMBER_ERROR,Config.ALERT_CLASS.ERROR_CSS);
        console.log("Cantidad de numeros del telefono debe sumar 10");
    }else {
      this.navCtrl.push( SaConsultaPage );
    }
  }

  checkTelLength(){
      if((this.prefijo.toString() + this.tel.toString()).length == 10){
          return true;
      }
      else{
          return false;
      }
  }

  getLocation(){
    this.location = [ 'Córdoba','Santa Fe', 'Rosario', 'Funes',  'Roldan', 'Otra'  ];
  }

  getEmail(){
    this.emailList = [ 'jincarbone@cdt.com.ar','jincarbone@gmail.com.ar', 'Otro'  ];
  }

  getAddress(){
    this.addressList = [ 'La valle 400','La valle 600', 'Otro'  ];
  }

  validateTelNumber(number, length){
    this.telFinal;
     if(number === null || number === undefined) this.tel = undefined;
     else if(this.utils.validationInputTypeNumber(number,length)){
         this.telFinal = number;
     }
     else{
         this.tel = this.telFinal;
     }
 }

 validatePrefijoNumber(number, length){
    this.prefijoFinal;
    if(number === null || number === undefined) this.prefijo = undefined;
    else if(this.utils.validationInputTypeNumber(number,length)){
        this.prefijoFinal = number;
    }
    else{
        this.prefijo = this.prefijoFinal;
    }
}


}
