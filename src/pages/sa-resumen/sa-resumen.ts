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

    this.userData = this.utils.getFormSolicitudAtencion();

    this.datos = this.userData[1].step2;
    this.dataSymptom = this.userData[2].step3;
    this.dataTime = this.userData[3].step4;

    console.log("datos",this.datos.addressList);
    this.addressList = this.datos.addressList;
    this.cod = this.datos.cod;
    this.telDataSelect = this.datos.telSelect;
    this.direction = this.datos.direction;
    this.email = this.datos.email;
    this.emailList = this.datos.emailList;
    this.location = this.datos.location;
    this.tel = this.datos.tel;

    this.symptom = this.dataSymptom.symptom;
    this.description = this.dataSymptom.description;

    if(this.dataTime)
      this.time = this.dataTime.time;
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
