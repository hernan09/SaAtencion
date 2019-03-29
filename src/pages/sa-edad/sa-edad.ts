import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaAddressPage } from '../sa-address/sa-address';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SaQuestionSymptomPage } from '../sa-question-symptom/sa-question-symptom';
import { NavigatorPage } from './../navigator/navigator';
import { Utils } from './../../providers/utils';
import { ChangeDetectorRef } from '@angular/core';
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
  socio:any;

  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef, public navParams: NavParams,public utils: Utils,) {

    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 5 EDADDD!!: ", dataPage);

    this.getAge();
    this.getName();
  }

  ionViewDidLoad() {
    this.getBackData();
    this.menu.setArrowBack(true);
    console.log(this.navParams.get("quetionSymtom"));
  }

  getBackData(){

    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }

      console.log("datos de la edad",dataPage[count-1]);
      this.radioSelected = dataPage[count-1].step5.time;//paso: cambiar variable => 2

      if(dataPage[count-1].section){
        this.question = dataPage[count-1].section.question;
        this.showQuestion = dataPage[count-1].section.showQuestion;
      }
      else{
        this.question = dataPage[count-1].question;
      }

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }else {
      this.getSymptomData();
    }
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  getSymptomData() {
    if(this.navParams.get("quetionSymtom")) {
      this.symptom = this.navParams.get("quetionSymtom");
      console.log("quetionSymtom",this.symptom);

      this.question = this.symptom.question;
      this.showQuestion = this.symptom.showQuestion;
    } else {
      this.question = '¿El paciente tiene antecedentes de convulciones febriles o ha  convulsionado alguna vez por fiebre?'
      console.log("otro sintoma");
    }
  }

  getDataTime() {
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
    if('¿Además este vomitando?' == this.question || '¿El dolor es debido a un golpe o traumatismo?' == this.question){
      this.navCtrl.setRoot( SaConsultaPage );
    }else {
      this.navCtrl.setRoot( SaTiempoPage );
    }
  }

  gotoPage(data){

    this.utils.backPage(false);

    this.saveData();
    if(this.showQuestion){
      if('¿Además este vomitando?' == this.question) {
        let quetionValue = {
          question : "¿Tuvo alguna cirugía abdominal en el último mes?"
        }
        if(data == 'No'){
          this.navCtrl.push( SaQuestionSymptomPage, {'quetionValue' : quetionValue} );
        }else {
          this.navCtrl.push( SaAddressPage  );
        }
      } else{
        let quetionValue = {
          question : "¿El paciente tiene antecedentes de convulciones febriles o ha convulsionado alguna vez por fiebre?"
        }
        if(data == 'Si'){
          this.navCtrl.push( SaQuestionSymptomPage, {'quetionValue' : quetionValue} );
        }else {
          this.navCtrl.push( SaAddressPage );
        }
      }

    } else {
      this.navCtrl.push( SaAddressPage );
    }
  }

  saveData(){

    this.dataForm = {
      "step5": this.profileForm.value,
      "section":this.symptom,
      "question":this.question
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,4);
  }

  ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
    this.utils.backPage(true);
  }
}
