import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaAddressPage } from '../sa-address/sa-address';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { NavigatorPage } from './../navigator/navigator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';

import { ChangeDetectorRef } from '@angular/core';
/**
 * Generated class for the SaTiempoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-tiempo',
  templateUrl: 'sa-tiempo.html',
})
export class SaTiempoPage {
  @ViewChild(NavigatorPage) menu : NavigatorPage;
  time:any;
  period:boolean;

  profileForm = new FormGroup({
    time: new FormControl('', Validators.required),
  })
  title = 'Solicitud de Atención';
  dataForm:any;
  radioTime:string;
  symptom:string;
  socio:any;

  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef,  public navParams: NavParams,public utils: Utils) {

    this.getName();

    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 4 tiempo: ", dataPage);
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
      console.log("estoy EN TIEMPO PAGE: ",dataPage[count-1].section)
      this.symptom = dataPage[count-1].section;//paso: cambiar variable => 2
      this.radioTime = dataPage[count-1].step4.time;//paso: cambiar variable => 2
      this.getTime();

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }else{
      console.log("no ENTRO ");
      this.getSymptomData();
      this.getTime();
    }
  }

  getSymptomData() {
    if(this.navParams.get("valueSymptom")){
      this.symptom = this.navParams.get("valueSymptom");
    }
    console.log("this.symptom",this.symptom);
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getDataTime() {
    let data = this.profileForm.value.time

    this.gotoPage(data);
  }

  getTime() {
    console.log("this.symptom22222222",this.symptom)
    if(this.symptom == 'Fiebre'){
      this.time =
      [
        {
          period: "Menos de 1 mes de vida",
          page: "1"
        },{
          period: "Menos de 10 años",
          page: 'SaEdadPage'
        },{
          period: "Más de 10 años",
          page: "3"
        }
      ]
    }else {
      this.time =
      [
        {
          period: "Menos de 10 años",
          page: 'SaEdadPage'
        },{
          period: "Más de 10 años",
          page: "3"
        }
      ]
    }

  }

  previusPage() {
    this.navCtrl.setRoot( SaConsultaPage );
  }

  gotoPage(page){
    this.utils.backPage(false);
    this.saveData();

    if(this.symptom == 'Dolor de oido') {
      var quetionSymtom = {
        question : "¿El dolor de oído le provoca llanto al niño?",
        showQuestion: false,
      }
    }else {
      var quetionSymtom = {
        question : "¿El paciente también tiene fiebre?",
        showQuestion: true,
      }
    }

    if(page == 'Menos de 10 años' && this.symptom == 'Dolor de oido'){
      this.navCtrl.push( SaEdadPage, {'quetionSymtom': quetionSymtom} );
    }
    else if(page == 'Menos de 10 años' && this.symptom == 'Dolor o molestia de garganta') {
      this.navCtrl.push( SaEdadPage, {'quetionSymtom': quetionSymtom} );
    }
    else if(page == 'Menos de 10 años') {
      this.navCtrl.push( SaEdadPage );
    }
    else {
      let sectionValue = {
        section : "tiepoPage"
      }
      this.navCtrl.push( SaAddressPage  ,{'section' : sectionValue});
    }
  }

  saveData(){

    this.dataForm = {
      "step4": this.profileForm.value,
      "section": this.symptom
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,3);
  }

  ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
    // this.utils.backPage(true);
  }
}
