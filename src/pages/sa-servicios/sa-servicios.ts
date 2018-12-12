import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaTiempoPage } from './../sa-tiempo/sa-tiempo';
import { NavigatorPage } from './../navigator/navigator';
import { Config } from './../../app/config';
import { AlertService } from './../../providers/alert.service';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
/**
 * Generated class for the SaServiciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-servicios',
  templateUrl: 'sa-servicios.html',
})
export class SaServiciosPage {
  @ViewChild(NavigatorPage) menu : NavigatorPage;
  dataService: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertService : AlertService,public alertCtrl :AlertController) {

    this.getDataOption();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getDataOption() {
    this.dataService = [
      {
        final:"una",
        type:"video Consulta Médica",
        description:"sin salir de tu casa",
        time:"15 minutos",
        dataTime:undefined,
        img: './assets/img/doc2.jpg',
        name: 'Dr. Provera, Hernán',
        section: "videoConsulta"
      },{
        final:"un",
        type:"Medico a Domicilio",
        description:"",
        time:null,
        dataTime:"Dentro de las siguientes 2 hs el médico estará en su domicilio",
        img: './assets/img/doc1.jpg',
        name: '',
        section: "MédicoD"
      }
    ]
  }

  previusPage() {
    this.navCtrl.setRoot( SaTiempoPage );
  }

  showAlertAdress(data){
    // this.alertService.showAlert(Config.TITLE.WRONG_EMAIL, Config.MSG.WRONG_EMAIL_ERROR,Config.ALERT_CLASS.OK_CSS);
    // console.log("El formato de email no es el correcto");
    if(data == 'videoConsulta') {
      var message = Config.MSG.SA_CONFIRMAR_CM;
      let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, message, Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
      alert.onDidDismiss(res => {
        if (res != false) {
          console.log("entro en 1");
          this.navCtrl.push(HomePage);
          this.alertService.showAlert("Video Consulta", "La Video consulta ha sido registrada exitosamente",Config.ALERT_CLASS.OK_CSS);
          //Si contesta que si al Reemplazar titular
          // this.notiService.hideNotifications();
          // this.checkDNI(dni,this.newMember)
        } else {
          // this.utils.hideLoader();
        }
      });
      alert.present();
    }else{
      var message = Config.MSG.SA_CONFIRMAR_MEDICO;
      let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, message, Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
      alert.onDidDismiss(res => {
        if (res != false) {
          this.navCtrl.push(HomePage);
          //Si contesta que si al Reemplazar titular
          // this.notiService.hideNotifications();
          // this.checkDNI(dni,this.newMember)
        } else {
          // this.utils.hideLoader();
        }
      });
      alert.present();
    }

  }

  getAlert(){
    console.log("alert!!!")
    this.alertService.showAlert("Médico a Domicilio", "Pedido de Médico a Domicilio registrado exitosamente",Config.ALERT_CLASS.OK_CSS);
  }


}
