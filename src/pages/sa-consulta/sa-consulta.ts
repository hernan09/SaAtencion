import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaLocationPage } from '../sa-location/sa-location';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { NavigatorPage } from './../navigator/navigator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { DataService } from './../../providers/data.service';
import { ChangeDetectorRef } from '@angular/core';
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
    otherSymptom: new FormControl(''),
    description : new FormControl('')
  })
  title = 'Solicitud de Atención';
  dataForm:any;
  symptomSelected:string;
  otherSymptomSelected:string;
  prefijoFinal:string;
  socio:any;
  //filter
  symptomValueSelect:string;
  result:string = '';
  arrayFinalSymptom :string[] = new Array() ;
  showPrediction:boolean;

  moreSymtom:boolean = false;

  public telefono;
  constructor( public navCtrl: NavController, private cdRef:ChangeDetectorRef, public navParams: NavParams,public utils: Utils, private data :DataService ) {

    this.selectOptions = {
      title: 'Síntoma',
    };

    this.getSymptom();
    // this.pageBack();
    this.getName();

    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 3: ", dataPage);
  }

  ionViewDidLoad() {
    this.showBackData();
    this.menu.setArrowBack(true);
  }

  showBackData() {
    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }
      this.symptomSelected = dataPage[count-1].step3.symptom;
      this.otherSymptomSelected = dataPage[count-1].step3.symptom;

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }
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

  otherSymtomSelected(){
    this.gotoPage('Fiebre');
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
    this.navCtrl.setRoot( SaLocationPage );
  }

  gotoPage(valueSymptom){

    this.utils.backPage(false);

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

    this.utils.setFormSolicitudAtencion(this.dataForm,"step3");
  }

  getSymptom() {
    this.symptom = [ 'Fiebre', 'Dolor de oido', 'Dolor o molestia de garganta', 'Odontalgia', 'Constipación', 'Otro' ];
  }

  nextPhoneNumber(){
    this.telefono = this.data.nextPhoneNumber();
  }

  /*filter did you mean*/
  filterData(array,data) {
    let prediction1 = array;
    var i,j,x,result,predictionData ='';
    for (i = 0; i < prediction1.length; i++) {
      result = this.symptomValueSelect;
      console.log("RESULT",result);
      for (x = 0; x < prediction1[i].length; x++) {
        predictionData =predictionData +prediction1[i][x]
        console.log("1-",predictionData)
        if(result.toLowerCase() == predictionData.toLowerCase()){
          if(this.symptomValueSelect.length > 2 ) {
              this.showPrediction = true;
              console.log("ENTROOOOOOO FILTRANDOOOOO**********************",this.arrayFinalSymptom.indexOf(data));
              if(this.arrayFinalSymptom.indexOf(data) == -1) this.arrayFinalSymptom.push(data);
          }
        }
      }
      predictionData = ''
    }
  }

  search(data) {
    console.log("input data",this.symptomValueSelect);
    console.log("data",data.target.value);
    this.symptomValueSelect = data.target.value;
    if(!this.symptomValueSelect) return;
    if(this.symptomValueSelect.length >  3 ){

      let prediction1 = ['costipacion' ,'afiebrado' , 'febricula' , 'temperatura alta' , 'piel caliente' , 'hipertermia' , 'piel calenturada', 'cuerpo calenturado' , 'escalofríos' , 'fiebre'];
      this.filterData(prediction1,'Fiebre');

      let prediction2 = ['dolor de oido' , 'dolor de oreja' , 'otalgia' , 'agua en el oido' , 'supuracion de oido' ,'cera en el oido' , 'tapon de cera' , 'otitis' , 'otitis media' , 'otitis externa' , 'oido tapado' , 'se me tapa el oido' , 'insecto en el oido' , 'bicho en el oido' , 'juguete en el oido' , 'cuerpo extraño en el oido' , 'bolita en el oido' , 'semilla en el oido' , 'hisopo en el oido' , 'cotonete en el oído']
      this.filterData(prediction2,'Dolor de oido');

      let prediction3 = ['dolor de garganta' , 'odinofagia' , 'dolor al tragar' , 'molestia al tragar' , 'ardor al tragar' , 'picazón de garganta' , 'garganta roja' , 'garganta colorada' , 'placas en la garganta' , 'puntos blancos en la garganta' , 'faringitis' , 'amigdalitis' , 'ganglios inflamados en el cuello']
      this.filterData(prediction3,'Dolor de Garganta');

      let prediction4 = ['odontalgia' , 'dolor de diente' , 'dolor de muela' , 'dolor dental' , 'muela inflamada' , 'carie' , 'gingivitis' , 'dolor de encias' , 'encia inflamada' , 'diente partido' , 'diente roto' , 'muela partida' , 'muela rota']
      this.filterData(prediction4,'Odontalgia');

      let prediction5 = ['costipacion' , 'constipacion' , 'estreñimiento' , 'estreñido' , 'no puede evacuar' , 'no hace caca' , 'no puede hacer caca' , 'no puede ir de cuerpo' , 'seco de vientre' , 'vientre seco']
      this.filterData(prediction5,'Constipacion');

    }else {
      this.showPrediction = false;
      this.arrayFinalSymptom = []
    }

  }

  setValueSymptom(value) {
    this.showPrediction = false;
    this.symptomValueSelect = value;
  }

  close() {
    this.showPrediction = false;
  }

  showMoreSymtom() {
    this.moreSymtom = true;
  }

  ionViewWillLeave() {
    console.log("ENTRO ACA?")

    this.utils.backPage(true);
  }
}
