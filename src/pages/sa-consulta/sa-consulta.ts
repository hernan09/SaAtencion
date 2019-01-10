import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaContactoPage } from '../sa-contacto/sa-contacto';
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

  validationSymptom:string="";

  profileForm = new FormGroup({
    symptom: new FormControl('', Validators.required),
  })
  title = 'Solicitud de Atención';
  dataForm:any;
  symptomSelected:string;
  public telefono;
  constructor( public navCtrl: NavController, public navParams: NavParams,public utils: Utils, private data :DataService ) {

    this.selectOptions = {
      title: 'Síntoma',
    };

    this.getSymptom();
    this.pageBack();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  get f() { return this.profileForm.controls; }

  getDataSymptom() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
  }

  previusPage() {
    this.navCtrl.setRoot( SaContactoPage );
  }


  gotoPage(){
    this.saveData();
    this.navCtrl.push( SaTiempoPage );
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
    this.symptom = [ 'Constipación', 'Diarrea', 'Fiebre', 'Síntomas de la piel', 'Alteraciones oculares', 'Dolor de garganta', 'Resfrio', 'Otro' ];
  }

  nextPhoneNumber(){
    this.telefono = this.data.nextPhoneNumber();
  }

}
