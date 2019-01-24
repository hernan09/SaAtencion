import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { NavigatorPage } from './../navigator/navigator';
import { Utils } from './../../providers/utils';

/**
 * Generated class for the SaQuestionSymptomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-question-symptom',
  templateUrl: 'sa-question-symptom.html',
})
export class SaQuestionSymptomPage {
  @ViewChild(NavigatorPage) menu : NavigatorPage;
  title = 'Solicitud de Atención';
  option:any;

  profileForm = new FormGroup({
    time: new FormControl('', Validators.required),
  })
  dataForm:any;
  radioSelected: string;
  symptom:any;
  question:string;
  showQuestion:boolean;
  socio:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils) {
    this.getSymptomData();
    this.getAge();
    this.pageBack();
    this.getName();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getSymptomData() {
    if(this.navParams.get("quetionValue")) {
      this.symptom = this.navParams.get("quetionValue");
      console.log("quetionValue",this.symptom);

      this.question = this.symptom.question;
      // this.showQuestion = this.symptom.showQuestion;
    }
  }

  getDataTime() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getAge() {
    this.option =
    [
      {
        period: "No"
      },{
        period: "Si"
      }
    ]
  }

  previusPage() {
    this.navCtrl.setRoot( SaEdadPage );
  }

  gotoPage() {
    this.saveData();
    this.navCtrl.push( SaServiciosPage );
  }

  saveData() {

    this.dataForm = {
      "step6": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,5);
  }

  pageBack() {

     let arrayDataForm = this.utils.getFormSolicitudAtencion();

     if(arrayDataForm.length > 4) {

        this.radioSelected  = arrayDataForm[4].step5.time;

     }
  }

}
