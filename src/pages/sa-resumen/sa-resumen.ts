import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from './../../providers/utils';
import { SaServiciosPage } from '../sa-servicios/sa-servicios';
import { NavigatorPage } from './../navigator/navigator';
import { Config } from './../../app/config';
import { AlertService } from './../../providers/alert.service';
import { HomePage } from '../home/home';
/**
 * Generated class for the SaResumenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-resumen',
  templateUrl: 'sa-resumen.html',
})
export class SaResumenPage {

  @ViewChild(NavigatorPage) menu : NavigatorPage;
  title = 'Solicitud de Atención';
  userData:any;
  datos:any;
  dataSymptom:any;
  dataTime:any;

  //datos users
  addressList:string;
  cod:number;
  direction:string;
  telDataSelect:string;
  email:string;
  emailList:string;
  location:string;
  tel:number;
  symptom:string;
  description:string;
  time:string;
  socio:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public utils: Utils,private alertService : AlertService) {

    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("array FINAL: ", dataPage);

    this.userData = this.utils.getFormSolicitudAtencion();

    if(this.userData[6] != undefined){
      this.cod = this.userData[6].step5telemail.cod;
      this.tel = this.userData[6].step5telemail.tel;
      this.telDataSelect = this.userData[6].step5telemail.telSelect;
      this.direction = this.userData[5].step4address.address;
      // this.email = this.datos.email;
      this.emailList = this.userData[6].step5telemail.emailList;
    }else {
      this.cod = this.userData[5].step5telemail.cod;
      this.tel = this.userData[5].step5telemail.tel;
      this.telDataSelect = this.userData[5].step5telemail.telSelect;
      this.direction = this.userData[4].step4address.address;
      // this.email = this.datos.email;
      this.emailList = this.userData[5].step5telemail.emailList;
    }

    this.location = this.userData[1].step2.location;
    this.symptom = this.userData[2].step3.symptom;
    this.description = this.userData[2].step3.description;

    if(this.userData[3].step4.time)
      this.time = this.userData[3].step4.time;
    else this.time = '';

    this.getName();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  previusPage() {
    this.navCtrl.setRoot( SaServiciosPage );
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  showAlertAdress(data){

    if(data == 'videoConsulta') {

      var message = Config.MSG.SA_CONFIRMAR_CM;
      let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, message, Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
      alert.onDidDismiss(res => {
        if (res != false) {
          console.log("entro en 1");
          this.navCtrl.push(HomePage);
          this.alertService.showAlert("Video Consulta", "La Video consulta ha sido registrada exitosamente",Config.ALERT_CLASS.OK_CSS);

        } else {
        }

      });
      alert.present();

    } else {
        var message = Config.MSG.SA_CONFIRMAR_MEDICO;
        let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, message, Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
        alert.onDidDismiss(res => {

          if (res != false) {
            this.navCtrl.push(HomePage);

          } else {
          }

        });
        alert.present();
    }
  }

}
