import { ChangeDetectorRef } from '@angular/core';
import { NavigatorPage } from './../navigator/navigator';
import { Observable } from 'rxjs';
import { AlertService } from '../../providers/alert.service';
import { Config } from './../../app/config';
import { NetworkService } from './../../providers/network.service';
import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { SolicitudVcPage } from '../solicitud-vc/solicitud-vc';
import { SaContactoPage } from '../sa-contacto/sa-contacto';
import { DataService } from '../../providers/data.service';
import { HomePage } from '../home/home';
import { Utils } from '../../providers/utils';
import { ToastService } from '../../providers/toast.service';
import { ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the SolicitudAtencionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-solicitud-atencion',
  templateUrl: 'solicitud-atencion.html',
})

export class SolicitudAtencionPage {
    data:any;
    dataForm: any;
    radio: string;

    public title ="Solicitud de Atención";
    @ViewChild(NavigatorPage) menu : NavigatorPage;

    profileForm = new FormGroup({
      partner: new FormControl('', Validators.required)
    })

    constructor(
      public navCtrl: NavController,
      public utils: Utils,
      private alertService : AlertService,
      public navParams: NavParams
     ){
      this.data = ["Incarbone Eduardo Oscar","Incarbone Maria Sol" ]

      this.pageBack();
    }

    ionViewCanEnter(){
      console.log("BACK",this.utils.getFormSolicitudAtencion());
      this.menu.setArrowBack(true);
    }

    getDataPartner() {
      this.dataForm = {
        "step1": this.profileForm.value
      }

      this.utils.setFormSolicitudAtencion(this.dataForm,0);
      console.log("getFormSolicitudAtencion",this.utils.getFormSolicitudAtencion());

      let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, 'La ultima dirección de atención fue: "Emilio mitre 457". ¿Se encuentra en este domicilio?', Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
      alert.onDidDismiss(res => {
        var location = 'Córdoba';
        var address = 'Emilio mitre 457';
        if (res != false) {
          //Si contesta que si al Reemplazar titular
          this.gotoPage(true,location,address);
        } else {
          this.gotoPage(false,undefined,undefined);
        }
      });
      alert.present();
    }

    gotoPage(data,location,address){
      let showAdress = {
        show: data,
        location : location,
        address: address
      }
      console.log(showAdress);
      this.navCtrl.push( SaContactoPage, {'showAdress' : showAdress} );
    }

    previusPage() {
      this.navCtrl.setRoot(HomePage);
    }

    pageBack() {
      let arrayDataForm = this.utils.getFormSolicitudAtencion();
       if(arrayDataForm.length > 0 ) {
         console.log("BACK FINAL",arrayDataForm[0].step1.partner);

        this.radio = arrayDataForm[0].step1.partner
       }
    }

}
