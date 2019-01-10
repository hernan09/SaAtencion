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

    constructor(public navCtrl: NavController, public utils: Utils){
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
      this.gotoPage();
    }

    gotoPage(){
      this.navCtrl.push( SaContactoPage );
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
