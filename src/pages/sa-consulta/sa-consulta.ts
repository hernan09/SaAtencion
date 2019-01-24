import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaContactoPage } from '../sa-contacto/sa-contacto';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { NavigatorPage } from './../navigator/navigator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { DataService } from './../../providers/data.service';
/**
 * Generated class for the SaConsultaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-consulta',
  templateUrl: 'sa-consulta.html',
})

export class SaConsultaPage {
  @ViewChild(NavigatorPage) menu : NavigatorPage;
  selectOptions:any;
  symptom:any;
  symptomValue:string="";
  symptomAnimation:boolean = false;
  descriptionData:string;
  description:string;
  countDescription:number=0;
  validationSymptom:string="";
  textareaLength:number=20;
  profileForm = new FormGroup({
    symptom: new FormControl('', Validators.required),
    description : new FormControl('')
  })
  title = 'Solicitud de Atención';
  dataForm:any;
  symptomSelected:string;
  prefijoFinal:string;
  socio:any;
  public telefono;
  constructor( public navCtrl: NavController, public navParams: NavParams,public utils: Utils, private data :DataService ) {

    this.selectOptions = {
      title: 'Síntoma',
    };

    this.getSymptom();
    this.pageBack();
    this.getName();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  get f() { return this.profileForm.controls; }

  getDataSymptom() {
    console.log("data", this.profileForm.value);
    let symptomFinal = this.profileForm.value.symptom
    if (symptomFinal == 'Fiebre' || symptomFinal == 'Dolor de oido' || symptomFinal == 'Dolor o molestia de garganta'){
      this.gotoPage(symptomFinal);
    } else {
      this.gotoPage(symptomFinal);
      console.log("otra página");
    }
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  onkeyup(number,length) {
    console.log(event);
    console.log(this.descriptionData.length);
    this.prefijoFinal;
    if(number === null || number === undefined) this.descriptionData = undefined;
    else if(this.utils.validationInputTypeNumber(number,length)){
        this.prefijoFinal = number;
    }
    else{
        this.descriptionData = this.prefijoFinal;
    }

    this.countDescription = this.descriptionData.length;
  }

  previusPage() {
    this.navCtrl.setRoot( SaContactoPage );
  }

  gotoPage(valueSymptom){
    this.saveData();

    if(valueSymptom == 'Odontalgia') {
      var quetionSymtom = {
        question:'¿El dolor es debido a un golpe o traumatismo?',
        showQuestion:false
      }
    }

    if(valueSymptom == 'Constipación') {
      var quetionSymtom = {
        question:'¿Además este vomitando?',
        showQuestion:true

      }
    }

    if(valueSymptom == 'Odontalgia' || valueSymptom == 'Constipación'){
      this.navCtrl.push( SaEdadPage, {'quetionSymtom': quetionSymtom} );
    }else {
      this.navCtrl.push( SaTiempoPage, {'valueSymptom': valueSymptom} );
    }
  }

  saveData(){

    this.dataForm = {
      "step3": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,2);
  }

  pageBack() {

     let arrayDataForm = this.utils.getFormSolicitudAtencion();

     if(arrayDataForm.length > 2) {

        this.symptomAnimation = true;
        this.symptomSelected  = arrayDataForm[2].step3.symptom;
     }
  }

  getSymptom() {
    this.symptom = [ 'Fiebre', 'Dolor de oido', 'Dolor o molestia de garganta', 'Odontalgia', 'Constipación', 'Otro' ];
  }

  nextPhoneNumber(){
    this.telefono = this.data.nextPhoneNumber();
  }

}
