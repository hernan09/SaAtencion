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

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils) {
    this.getTime();
    this.pageBack();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getDataTime() {
    console.log("data", this.profileForm.value);
    let data = this.profileForm.value.time

    this.gotoPage(data);
  }

  getTime() {
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
  }

  previusPage() {
    this.navCtrl.setRoot( SaConsultaPage );
  }

  gotoPage(page){

    this.saveData();

    if(page == 'Menos de 10 años'){
      this.navCtrl.push( SaEdadPage );
    }else {
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
