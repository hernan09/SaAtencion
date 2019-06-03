import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
import { SaLocationPage } from '../sa-location/sa-location';
import { SaEdadPage } from '../sa-edad/sa-edad';
import { NavigatorPage } from './../navigator/navigator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { DataService } from './../../providers/data.service';
import { ChangeDetectorRef } from '@angular/core';

import { Http, HttpModule } from '@angular/http';
//import { predicJsonData } from '../../assets/predic.json';

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

export class SaConsultaPage  {

  @ViewChild(NavigatorPage) menu : NavigatorPage;

  items:any;

  predictionData:any;
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
  hideCallEmergency:boolean;
  showBtnNext:boolean;
  callEmergency:boolean;
  //filter
  symptomValueSelect:string;
  PredictSymptom:string;
  PredictShowSymptom:string;
  result:string = '';
  arrayFinalSymptom :string[] = new Array() ;
  showPrediction:boolean=false;

  moreSymtom:boolean = false;
  animationSearch:boolean = false;

  public telefono;

  constructor( public navCtrl: NavController,
      private cdRef:ChangeDetectorRef,
      public navParams: NavParams,
      public utils: Utils,
      private data :DataService,
      public alertController: AlertController,
      public http:Http,
     
      ) {

    this.selectOptions = {
      title: 'Síntoma',
    };

    this.getSymptom();
    // this.pageBack();
    this.getName();
    //predictivo
    this.initializeItems();




    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 3: ", dataPage);
  }
//predictivo logica
initializeItems() {
 this.items=this.predictionData

}
getPredic(){
  this.http.get('./assets/predic.json').subscribe(datapredic=>{
     this.predictionData=datapredic.json()

 })

}



getItems(ev: any) {
  // Reset items back to all of the items
  this.initializeItems();
  this.showPrediction=true
  // set val to the value of the searchbar
  const val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.items = this.items.filter((item) => {


      return (item.SINTOMA.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }
}


  ionViewDidLoad() {
    this.showBackData();
    this.menu.setArrowBack(true);
    this.getPredic();
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
    var symptomFinal = ''
    console.log("data", this.profileForm.value);
    if(this.profileForm.value != 'Otro') symptomFinal = this.profileForm.value.symptom;
    else { symptomFinal = this.symptomValueSelect }
    if (symptomFinal == 'Fiebre' || symptomFinal == 'Dolor de oido' || symptomFinal == 'Dolor o molestia de garganta'){
      this.gotoPage(symptomFinal);
    } else {
      this.gotoPage(symptomFinal);
      console.log("otra página");
    }
  }

  otherSymtomSelected(){
    console.log("sintoma del predictivo",this.PredictShowSymptom);
    for(let i=0;i<=this.items.length-1;i++){
      if(this.PredictShowSymptom==this.items[i].SINTOMA){


        this.PredictSymptom=this.items[i].DIAGNOSTICO
      }
    }

    this.gotoPage(this.PredictSymptom);
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
    console.log("SOCIO",this.socio)
    this.hideCallEmergency = !(this.socio[1] == 'Julio Cesar') || !(this.socio[1] == 'Infran Emiliano'|| !(this.socio[1]=='Andres Lauga'));
    this.showBtnNext = this.socio[1] == 'Infran Emiliano'|| this.socio[1] == 'Andres Lauga';
    // this.callEmergency =(this.symptomSelected == 'Otro' && this.socio[1] == 'Hernan Dario') || (this.symptomSelected == 'Otro' && this.socio[1] == 'Incarbone Eduardo Oscar') ;

    if(this.socio[1] == 'Hernan Dario'){
      this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({

      message: 'Según nuestro registros, su última atención fue por fiebre. ¿Sigue con este síntoma?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm close');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.gotoPage('Fiebre');
          }
        }
      ]
    });

    await alert.present();
  }

  onChange(number,length) {
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
    var i,x,result,predictionData ='';
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
    if(this.symptomValueSelect/*.length > 3*/){

      let prediction1 = ['costipacion' ,'afiebrado' , 'febricula' , 'temperatura alta' , 'piel caliente' , 'hipertermia' , 'piel calenturada','sentirse caliente', 'cuerpo calenturado' , 'escalofríos' , 'fiebre'];
      this.filterData(prediction1,'Fiebre');

      let prediction2 = ['dolor de oido' ,'tengo algo en el odio' ,'dolor de oreja' , 'otalgia' , 'agua en el oido' , 'supuracion de oido' ,'cera en el oido' , 'tapon de cera' , 'otitis' , 'otitis media' , 'otitis externa' , 'oido tapado' , 'se me tapa el oido' , 'insecto en el oido' , 'bicho en el oido' , 'juguete en el oido' , 'cuerpo extraño en el oido' , 'bolita en el oido' , 'semilla en el oido' , 'hisopo en el oido' , 'cotonete en el oído']
      this.filterData(prediction2,'Dolor de oido');

      let prediction3 = ['dolor de garganta' ,'duele la garganta','duele al tragar','me duele al tragar','al tragar duele la garganta','duele cuando trago', 'odinofagia','pica la garganta','arde la garganta','pica la garganta al tragar','arde la garganta al tragar','' , 'dolor al tragar' , 'molestia al tragar' , 'ardor al tragar' , 'picazón de garganta' , 'garganta roja' , 'garganta colorada' , 'placas en la garganta' , 'puntos blancos en la garganta' , 'faringitis' , 'amigdalitis' , 'ganglios inflamados en el cuello']
      this.filterData(prediction3,'Dolor o molestia de garganta');

      let prediction4 = ['odontalgia' , 'dolor de diente' , 'dolor de muela' , 'dolor dental','me sacaron una muela' , 'muela inflamada' , 'carie' , 'gingivitis' , 'dolor de encias' , 'encia inflamada' , 'diente partido' , 'diente roto' , 'muela partida' , 'muela rota','me sacaron un diente','tengo un diente roto']
      this.filterData(prediction4,'Odontalgia');

      let prediction5 = ['costipacion' , 'constipacion' , 'estreñimiento' , 'estreñido' , 'no puede evacuar' , 'no hace caca' , 'no puede hacer caca' , 'no puede ir de cuerpo' , 'seco de vientre' , 'vientre seco']
      this.filterData(prediction5,'Constipacion');

      let prediction6 = ['BRADICARDIA' , 'LE LATE LENTO EL CORAZON' , 'ME LATE LENTO EL CORAZON' , 'ME LATE LENTO EL CORAZON' , 'LATE LENTO EL CORAZON' , 'EL CORAZON LE LATE LENTO' , 'EL CORAZON ME LATE LENTO' , 'EL CORAZON LATE LENTO' , 'PULSO BAJO' , 'TIENE EL PULSO BAJO', 'TENGO EL PULSO BAJO' , 'ESTA CON EL PULSO BAJO' , 'ESTOY CON EL PULSO BAJO' , 'FRECUENCIA CARDIACA BAJA' , 'TIENE LA FRECUENCIA CARDIACA BAJA' , 'TENGO LA FRECUENCIA CARDIACA BAJA' , 'ESTA CON LA FRECUENCIA CARDIACA BAJA' , 'ESTOY CON LA FRECUENCIA CARDIACA BAJA' , 'FRECUENCIA CARDIACA LENTA' , 'TIENE LA FRECUENCIA CARDIACA LENTA', 'ESTOY CON L FRECUENCIA CARDIACA LENTA' , 'ESTA CON LA FRECUENCIA CARDIACA LENTA' , 'TENGO LA FRECUENCIA CARDIACA LENTA' , 'LATIDOS LENTOS' , 'TIENE LOS LATIDOS LENTOS' , 'TIENE LENTOS LOS LATIDOS' , 'TENGO LENTOS LOS LATIDOS' , 'TENGO LOS LATIDOS LENTOS' , 'ESTA CON LATIDOS LENTOS' , 'ESTA CON LOS LATIDOS DEL CORAZON LENTOS', 'ESTOY CON LATIDOS LENTOS' , 'ESTOY CON LOS LATIDOS DEL CORAZON LENTOS' , 'POCOS LATIDOS' , 'TIENE POCOS LATIDOS' , 'ESTA CON POCOS LATIDOS' , 'TENGO POCOS LATIDOS' , 'ESTOY CON POCOS LATIDOS' , 'POCAS PULSACIONES' , 'ESTA CON POCAS PULSACIONES' , 'ESTOY CON POCAS PULSACIONES', 'TIENE POCAS PULSACIONES' , 'TENGO POCAS PULSACIONES' , 'POCOS PULSO' , 'TIENE POCO PULSO' , 'TENGO POCO PULSO' , 'ESTA CON POCO PULSO' , 'TENGO POCO PULSO' , 'FRECUENCIA CARDIACA MENOR A 50 LATIDOS POR MINUTO' , 'TIENE UNA FRECUENCIA CARDIACA MENOR A 50 LATIDOS POR MINUTO' , 'ESTA CON UNA FRECUENCIA CARDIACA MENOR A 50 LATIDOS POR MINUTO', 'TENGO UNA FRECUENCIA CARDIACA MENOR A 50 LATIDOS POR MINUTO' , 'ESTOY CON UNA FRECUENCIA CARDIACA MENOR A 50 LATIDOS POR MINUTO']
      this.filterData(prediction6,'Bradicardia');

      let prediction7 = ['CONFUSION' , 'CONFUNDIDO' , 'CONFUSO' , 'ESTA CONFUNDIDO' , 'PERDIDO' , 'ESTA PERDIDO' , 'DESORIENTADO' , 'ESTA DESORIENTADO' , 'DESORIENTACION' , 'SE QUEDA DORMIDO', 'SOMNOLIENTO' , 'ESTA SOMNOLIENTO' , 'OBNUBILADO' , 'OBNUBILACION' , 'ESTA OBNUBILADO' , 'HABLA INCOHERENCIAS' , 'ACTUA DIFERENTE' , 'DICE INCOHERENCIAS' , 'NO RECONOCE' , 'NO ME RECONOCE', 'ESTA RARO' , 'ESTUPOR' , 'ESTA ESTUPOROSO' , 'ESTUPOROSO' , 'INCOHERENTE' , 'SOPOROSO' , 'ESTA SOPOROSO' , 'xx' , 'xx' , 'xx']
      this.filterData(prediction7,'Confusion-Desorientacion-Obnubilacion-Estupor');

    }else {
      this.showPrediction = false;
      this.arrayFinalSymptom = []
    }

  }

  setValueSymptom(value) {
     this.showPrediction = false;
     this.PredictShowSymptom=value;
    }



  close() {
    this.showPrediction = false;
  }

  showMoreSymtom() {
    this.moreSymtom = true;
  }

  topSearch(data){
    console.log("focus IN topSearch",data);
    this.animationSearch = data;
  }

  initialSearch(data){
    console.log("focus OUT initialSearch",data);
    this.animationSearch = data;
  }

  ionViewWillLeave() {
    console.log("ENTRO ACA?")

    // this.utils.backPage(true);
  }
}
