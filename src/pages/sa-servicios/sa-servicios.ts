import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaTiempoPage } from './../sa-tiempo/sa-tiempo';
import { SaContactoPage } from './../sa-contacto/sa-contacto';
import { SaResumenPage } from '../sa-resumen/sa-resumen';
import { NavigatorPage } from './../navigator/navigator';
import { Config } from './../../app/config';
import { AlertService } from './../../providers/alert.service';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Utils } from './../../providers/utils';
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
  title = 'Solicitud de Atención';
  socio:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertService : AlertService,public alertCtrl :AlertController,public utils: Utils) {

    this.getDataOption();
    this.getName();
  }

  ionViewDidLoad() {
    this.menu.setArrowBack(true);
  }

  getDataOption() {
    this.dataService = [
      {
        final:"un",
        type:"Medico a Domicilio",
        description:"",
        time:null,
        dataTime:"Dentro de las siguientes 2 hs un Médico Generalista estará en su domicilio",
        img: 'assets/img/medicator_demora.png',
        name: '',
        section: "MédicoD",
        title:"Solicitar un Médico a Domicilio",
        subTitle:''
      },
      {
        final:"una",
        type:"video Consulta Médica",
        description:"sin salir de tu casa",
        time:"10 minutos",
        dataTime:undefined,
        img: 'assets/img/doc2.jpg',
        name: 'Dr. Provera, Hernán',
        section: "videoConsulta",
        title:"Solicitar una Video Consulta Médica",
        subTitle:'Podes anticipar la llegada del médico...'
      }
    ]
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;
  }

  previusPage() {
    console.log("PASO POR ACA -> 1")
    this.navCtrl.setRoot( SaContactoPage );
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

  getAlert(){
    console.log("alert!!!")
    this.alertService.showAlert("Médico a Domicilio", "Pedido de Médico a Domicilio registrado exitosamente",Config.ALERT_CLASS.OK_CSS);
  }

  gotoPage(){
    this.utils.backPage(false);
    // this.navCtrl.push( SaResumenPage );
    this.navCtrl.push( HomePage );
  }

  ionViewWillLeave() {
    // this.utils.backPage(true);
  }
}
