import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController  } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { NavigatorPage } from './../navigator/navigator';
import { ViewChild } from '@angular/core';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SaContactoPage } from '../sa-contacto/sa-contacto';
import { SolicitudAtencionPage } from '../solicitud-atencion/solicitud-atencion';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaQuestionSymptomPage } from '../sa-question-symptom/sa-question-symptom';

import { ChangeDetectorRef } from '@angular/core';
import { popapsCont } from '../../providers/poapCont';


@IonicPage()
@Component({
  selector: 'page-sa-address',
  templateUrl: 'sa-address.html',
})
export class SaAddressPage {

  @ViewChild(NavigatorPage) menu : NavigatorPage;

  profileForm = new FormGroup({
    address: new FormControl('', Validators.required)
  })

  title = 'Solicitud de Atención';
  addressList:any;
  dataForm:any;
  socio: any;
  validationLocation:string = "";
  selectOptions: any;
  backSection:any;

  localidades:any
  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef, public navParams: NavParams, public utils: Utils,public alertcontroller:AlertController,public popapsCont:popapsCont) {

    this.getAddress();
    this.getName();

    this.selectOptions = {
      title: 'Dirección',
    };

    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 6 adress: ", dataPage);
  }

  ionViewDidLoad() {
    this.getBackData();
    this.menu.setArrowBack(true);
  }

  getBackData(){

    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }

      console.log("dartos de direccion********",dataPage[count-1].section);
      this.validationLocation = dataPage[count-1].step4address.address;//paso: cambiar variable => 2
      this.backSection = dataPage[count-1].section;
      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    } else {

      if(this.navParams.get("section")){
        this.backSection = this.navParams.get("section");
        console.log('backSection',this.backSection.section);
      }else {
        console.log("estoy en adres y no entro a backsection")
        this.backSection = {
          section:null
        }
      }

    }
  }

  get f() { return this.profileForm.controls; }

  getAddress(){
    this.addressList = [ 'Emilio mitre 457','La valle 600', 'Otro'  ];
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
    if(this.socio[1] == 'Andres Lauga'){
      this.presentAlertConfirm();
    }
  }

  getDataContact() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  backtoSymptom(){
    this.navCtrl.push(SaConsultaPage);
  }

  gotoPage(){
    this.utils.backPage(false);
    this.saveData();
    this.navCtrl.push( SaContactoPage );
  }

  saveData(){

    this.dataForm = {
      "step4address": this.profileForm.value,
      "section":this.backSection
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,4);
  }

  previusPage() {
    if(this.backSection.section === "questionSymptom") {
      this.navCtrl.setRoot( SaQuestionSymptomPage );
    }else if(this.backSection.section === 'tiepoPage'){
      this.navCtrl.setRoot( SaTiempoPage );
    }
    else {
      console.log("FUE A EDADPAGE");
      this.navCtrl.setRoot( SaEdadPage );
    }
  }

  ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
    // this.utils.backPage(true);
  }

  async presentAlertConfirm() {
    this.popapsCont.contadorPopaps++;
    if(this.popapsCont.contadorPopaps>=2){
      console.log("ya agrego 2 sintomas")
    }else{
      const alert = await this.alertcontroller.create({

        message: '¿Desea agregar otro síntoma?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm close');
            }
          }, {
            text: 'Si',
            handler: () => {
              console.log('Confirm Okay');
              this.backtoSymptom();
            }
          }
        ]
      });
  
      await alert.present();
    }
   
  }
}
