import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaQuestionSymptomPage } from '../sa-question-symptom/sa-question-symptom';
import { NavigatorPage } from './../navigator/navigator';
import { Utils } from './../../providers/utils';
/**
 * Generated class for the SaEdadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-edad',
  templateUrl: 'sa-edad.html',
})
export class SaEdadPage {
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils,) {
    this.getSymptomData();
    this.getAge();
    this.pageBack();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getSymptomData() {
    if(this.navParams.get("quetionSymtom")) {
      this.symptom = this.navParams.get("quetionSymtom");
      console.log("quetionSymtom",this.symptom);

      this.question = this.symptom.question;
      this.showQuestion = this.symptom.showQuestion;
    } else{
      this.question = '¿El paciente tiene antecedentes de convulciones febriles o ha  convulsionado alguna vez por fiebre?'
      console.log("otro sintoma");
    }
  }

  getDataTime() {
    console.log("data", this.profileForm.value);
    this.gotoPage(this.profileForm.value.time);
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
    this.navCtrl.setRoot( SaTiempoPage );
  }

  gotoPage(data){
    this.saveData();
    if(this.showQuestion){
      if('¿Además este vomitando?' == this.question) {
        let quetionValue = {
          question : "¿Tuvo alguna cirugía abdominal en el último mes?"
        }
        if(data == 'No'){
          this.navCtrl.push( SaQuestionSymptomPage, {'quetionValue' : quetionValue} );
        }else {
          this.navCtrl.push( SaServiciosPage );
        }
      } else{
        let quetionValue = {
          question : "¿El paciente tiene antecedentes de convulciones febriles o ha convulsionado alguna vez por fiebre?"
        }
        if(data == 'Si'){
          this.navCtrl.push( SaQuestionSymptomPage, {'quetionValue' : quetionValue} );
        }else {
          this.navCtrl.push( SaServiciosPage );
        }
      }

    } else {
      this.navCtrl.push( SaServiciosPage );
    }
  }

  saveData(){

    this.dataForm = {
      "step5": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,4);
  }

  pageBack() {

     let arrayDataForm = this.utils.getFormSolicitudAtencion();

     if(arrayDataForm.length > 4) {

        this.radioSelected  = arrayDataForm[4].step5.time;

     }
  }


}
