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
    name1: string = '';
    name2: string = '';
    tycs1:boolean;
    tycs2:boolean;
    enable:boolean;
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

    btnValidate() {
      if(this.tycs1 || this.tycs2 || (this.tycs1 && this.tycs2)){
        this.enable = true;
      } else {
        this.enable = false;
      }
    }

    getDataPartner() {
      // this.dataForm = {
      //   "step1": this.profileForm.value
      // }

      if(this.tycs1) {
        this.name1 = 'Incarbone Eduardo Oscar';
      }
      if(this.tycs2) {
        this.name2 = 'Incarbone Maria Sol';
      }

      let check = {
        users: [this.name1,this.name2],
        users1:this.tycs1,
        users2:this.tycs2
      }

      this.dataForm = {
        "step1": check
      }

      this.utils.setFormSolicitudAtencion(this.dataForm,0);

      let alert = this.alertService.showOptionAlert(Config.TITLE.WARNING_TITLE, 'Tenemos este domicilio asociado a vos: "Emilio mitre 457". ¿Te encontras en el mismo?', Config.ALERT_OPTIONS.SI, Config.ALERT_OPTIONS.NO,Config.ALERT_CLASS.ERROR_CSS);
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
      this.navCtrl.push( SaContactoPage, {'showAdress' : showAdress} );
    }

    previusPage() {
      this.navCtrl.setRoot(HomePage);
    }

    pageBack() {
      let arrayDataForm = this.utils.getFormSolicitudAtencion();
       if(arrayDataForm.length > 0 ) {
         this.enable = true;
         console.log("BACK FINAL",arrayDataForm[0].step1.partner);

        this.radio = arrayDataForm[0].step1.partner
        this.tycs1 = arrayDataForm[0].step1.users1
        this.tycs2 = arrayDataForm[0].step1.users2
       }
    }

}
