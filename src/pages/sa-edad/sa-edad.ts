import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { SaTiempoPage } from '../sa-tiempo/sa-tiempo';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils,) {
    this.getAge();
    this.pageBack();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getDataTime() {
    console.log("data", this.profileForm.value);
    this.gotoPage();
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

  gotoPage(){
    this.saveData();
    this.navCtrl.push( SaServiciosPage );
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
