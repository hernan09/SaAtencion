import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaAddressPage } from '../sa-address/sa-address';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { NavigatorPage } from './../navigator/navigator';
import { Utils } from './../../providers/utils';
import { ChangeDetectorRef } from '@angular/core'; 
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

  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef, public navParams: NavParams,public utils: Utils) {
    this.getSymptomData();
    this.getAge();
    this.getName();
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
      console.log("LA ULTIMA PAGINA",dataPage[count-1].question)
      this.radioSelected = dataPage[count-1].step6.time;//paso: cambiar variable => 2
      this.question = dataPage[count-1].question;//paso: cambiar variable => 2

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }
  }

  getSymptomData() {
    if(this.navParams.get("quetionValue")) {
      this.symptom = this.navParams.get("quetionValue");
      console.log("quetionValue",this.symptom);

      this.question = this.symptom.question;
    }
  }

  getDataTime() {
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
    this.utils.backPage(false);
    this.saveData();

    let sectionValue = {
      section : "questionSymptom"
    }
    this.navCtrl.push( SaAddressPage ,{'section' : sectionValue} );
  }

  saveData() {

    this.dataForm = {
      "step6": this.profileForm.value,
      "question":this.question
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,5);
  }

  ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
    // this.utils.backPage(true);
  }
}
