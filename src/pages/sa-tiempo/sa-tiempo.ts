import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { NavigatorPage } from './../navigator/navigator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils) {
    this.getSymptomData();
    this.getTime();
    this.pageBack();
    this.getName();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getSymptomData() {
    this.symptom = this.navParams.get("valueSymptom");
    console.log("this.symptom",this.symptom);
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getDataTime() {
    console.log("data", this.profileForm.value);
    let data = this.profileForm.value.time

    this.gotoPage(data);
  }

  getTime() {
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
      this.navCtrl.push( SaServiciosPage );
    }
  }

  saveData(){

    this.dataForm = {
      "step4": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,3);
  }

  pageBack() {

     let arrayDataForm = this.utils.getFormSolicitudAtencion();

     if(arrayDataForm.length > 3) {

        this.radioTime  = arrayDataForm[3].step4.time;

     }
  }

}
