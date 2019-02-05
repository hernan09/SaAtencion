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
  telDataSelect:string;
  prefijoFinal:number;
  private prefijo : number = undefined;
  private tel: number;
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
    location: new FormControl('', Validators.required),
    addressList: new FormControl('', Validators.required),
    direction: new FormControl('' ),
    telSelect: new FormControl('',Validators.required )
  })
  title = 'Solicitud de Atención';
  dataForm:any;
  otherEmail:string;
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


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public utils: Utils,
              private alertService : AlertService,) {

    this.selectOptions = {
      title: 'Localidad',
    };
    this.emailTitle = {
      title: 'Email',
    };
    this.telTitle = {
      title: 'Teléfono',
    };
    this.adressTitle = {
      title: 'Dirección',
    };
    this.getName();
    this.getTel();
    this.getEmail();
    this.getAddress();
    this.getLocation();
    this.getInformationMaps();

    this.pageBack();
  }

  get f() { return this.profileForm.controls; }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getDataContact() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  getInformationMaps(){
    // console.log("showAdress",this.informationMaps);

    if(this.navParams.get("showAdress")){
      this.informationMaps = this.navParams.get("showAdress");
      console.log(this.informationMaps != undefined)
      if(this.informationMaps.show) {
        this.showAddress = this.informationMaps.show;
        this.validationLocation = this.informationMaps.location;
        this.addressShow = this.informationMaps.address;
      }
    }else {
      this.showAddress = true;
    }
  }

  previusPage() {
    this.navCtrl.setRoot( SolicitudAtencionPage );
  }

  gotoPage(){

    if(!this.checkTelLength()){
        this.alertService.showAlert(Config.TITLE.WRONG_NUMBER, Config.MSG.WRONG_NUMBER_ERROR,Config.ALERT_CLASS.ERROR_CSS);
        console.log("Cantidad de numeros del telefono debe sumar 10");
    }else {
      this.saveData();
      this.navCtrl.push( SaConsultaPage );
    }
  }

  saveData(){

    this.dataForm = {
      "step2": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,1);
  }

  pageBack() {
     let arrayDataForm = this.utils.getFormSolicitudAtencion();
    console.log("back",arrayDataForm);
     if(arrayDataForm.length > 1) {
         this.backDataCod = true;
         this.telAnimation = true;
         this.emailAnimation = true;
         this.addresAnimation = true;

         this.telValidateFinal=6;
         this.codValidateFinal=2;


         if(arrayDataForm[1].step2.telSelect == ""){
           arrayDataForm[1].step2.telSelect = "Otro";
         }
         if(arrayDataForm[1].step2.emailList == ""){
           arrayDataForm[1].step2.emailList = "Otro";
         }
         if(arrayDataForm[1].step2.addressList == ""){
           arrayDataForm[1].step2.direction = "Otro";
         }

        this.prefijo            = arrayDataForm[1].step2.cod;
        // document.getElementById("cod").setAttribute("value",arrayDataForm[1].step2.cod);
        this.tel                = arrayDataForm[1].step2.tel;
        this.otherEmail         = arrayDataForm[1].step2.email;//otro
        this.emailShow          = arrayDataForm[1].step2.emailList;
        this.validationLocation = arrayDataForm[1].step2.location;
        this.addressShow        = arrayDataForm[1].step2.addressList;
        this.telDataSelect      = arrayDataForm[1].step2.telSelect;
        this.validationAddress  = arrayDataForm[1].step2.direction;//otro
     }
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
    this.prefijoFinal;
    if(number === null || number === undefined) this.prefijo = undefined;
    else if(this.utils.validationInputTypeNumber(number,length)){
        this.prefijoFinal = number;
    }
    else{
        this.prefijo = this.prefijoFinal;
    }
    this.codValidateFinal = this.prefijoFinal.toString().length;

  }


}
