import { NavigatorPage } from './../navigator/navigator';
import { Utils } from './../../providers/utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SolicitudAtencionPage } from '../solicitud-atencion/solicitud-atencion';
import { SaAddressPage } from '../sa-address/sa-address';
import { ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Config } from './../../app/config'; 
import { AlertService } from './../../providers/alert.service';

import { ChangeDetectorRef } from '@angular/core';
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
  telDataSelect:string;
  prefijoFinal:number;
  prefijo : number = undefined;
  tel: number;
  emailTitle: any;
  telTitle: any;
  adressTitle:any;
  telSelect:any;

  //validation input color
  validationCod:number;
  validationNum:number;
  validationAddress:string = "";
  validationLocation:string = "";
  validationEmail:string;

  profileForm = new FormGroup({
    cod: new FormControl('', Validators.minLength(1)),
    tel: new FormControl('', Validators.minLength(6)),
    email: new FormControl('', Validators.email),
    emailList: new FormControl('', Validators.required),
    // location: new FormControl('', Validators.required),
    // addressList: new FormControl('', Validators.required),
    // direction: new FormControl('' ),
    telSelect: new FormControl('',Validators.required )
  })

  dataForm:any;
  otherEmail:string = "";
  informationMaps: any;
  showAddress :boolean;
  socio: any;
  telValidateFinal:number;
  codValidateFinal:number;
  //label animation
  backDataCod:boolean = false;
  telAnimation:boolean = false;
  emailAnimation:boolean = false;
  addresAnimation:boolean = false;
  title:string =  'Solicitud de Atención';

  constructor(public navCtrl: NavController,
              private cdRef:ChangeDetectorRef,
              public navParams: NavParams,
              public utils: Utils,
              private alertService : AlertService
              ) {
    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 6 CONTACTO: ", dataPage);
    this.emailTitle = {
      title: 'Email',
    };
    this.telTitle = {
      title: 'Teléfono',
    };

    this.getName();
    this.getTel();
    this.getEmail();
  }

  getBackData() {

    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }
      this.title = 'Solicitud de Atención';
      console.log('**ENTRO POR ACA**',dataPage[count-1].step5telemail);
      this.emailShow = dataPage[count-1].step5telemail.emailList;//paso: cambiar variable => 2
      this.otherEmail = dataPage[count-1].step5telemail.email;//paso: cambiar variable => 2
      this.telDataSelect = dataPage[count-1].step5telemail.telSelect;
      this.tel = dataPage[count-1].step5telemail.tel;
      this.prefijo = dataPage[count-1].step5telemail.cod;

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }
  }

  get f() { return this.profileForm.controls; }

  ionViewDidLoad() {
    this.getBackData();

    this.menu.setArrowBack(true);
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getDataContact() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  // getInformationMaps(){
  //   // console.log("showAdress",this.informationMaps);
  //
  //   if(this.navParams.get("showAdress")){
  //     this.informationMaps = this.navParams.get("showAdress");
  //     console.log(this.informationMaps != undefined)
  //     if(this.informationMaps.show) {
  //       this.showAddress = this.informationMaps.show;
  //       this.validationLocation = this.informationMaps.location;
  //       this.addressShow = this.informationMaps.address;
  //     }
  //   }else {
  //     this.showAddress = true;
  //   }
  // }

  previusPage() {
    this.navCtrl.setRoot( SaAddressPage );
  }

  gotoPage(){
    console.log("this.otherEmail",this.otherEmail);
    this.utils.backPage(false);
    if(!this.checkTelLength()){
        this.alertService.showAlert(Config.TITLE.WRONG_NUMBER, Config.MSG.WRONG_NUMBER_ERROR,Config.ALERT_CLASS.ERROR_CSS);
        console.log("Cantidad de numeros del telefono debe sumar 10");
    }else if(this.otherEmail && !this.validateEmail(this.otherEmail)){
      this.alertService.showAlert(Config.TITLE.WRONG_EMAIL, Config.MSG.WRONG_EMAIL_ERROR,Config.ALERT_CLASS.ERROR_CSS);
      console.log("El formato de email no es el correcto");
    }
    else {
      this.saveData();
      this.navCtrl.push( SaServiciosPage );
    }
  }

  saveData(){

    this.dataForm = {
      "step5telemail": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,9);
  }

  checkTelLength(){
    if(this.telDataSelect == 'Otro' ){
      console.log("prefijo",this.prefijo);
      console.log("tel",this.tel);
      if(this.prefijo && this.tel && (this.prefijo.toString() + this.tel.toString()).length == 10 ){
          return true;
      }
      else{
          return false;
      }
    }else {
      return true;
    }
  }

  getLocation(){
    this.location = [ 'Córdoba', 'Rosario', 'Funes' ];
  }

  getEmail(){
    this.emailList = [ 'jincarbone@cdt.com.ar','jincarbone@gmail.com.ar', 'Otro'  ];
  }

  getAddress(){
    this.addressList = [ 'Emilio mitre 457','La valle 600', 'Otro'  ];
  }
  getTel(){
    this.telSelect = [ '011 - 15 42670066','011 - 15 42670055', 'Otro'  ];
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

     this.telValidateFinal = this.telFinal.toString().length;
     console.log("this.telValidateFinal",this.telValidateFinal);
 }

 validatePrefijoNumber(number, length){
    // console.log("prefijoFinal",this.prefijoFinal);
    // console.log("number",number);
    // console.log("length",length);
    // this.prefijoFinal;
    if(number === null || number === undefined) this.prefijo = undefined;
    else if(this.utils.validationInputTypeNumber(number,length)){
        this.prefijoFinal = number;
    }
    else{
        this.prefijo = this.prefijoFinal;
    }
    this.codValidateFinal = this.prefijoFinal.toString().length;

  }
  validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }

  ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
    // this.utils.backPage(true);
  }
}
