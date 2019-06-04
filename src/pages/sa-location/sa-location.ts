import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from './../../providers/utils';
import { NavigatorPage } from './../navigator/navigator';
import { ViewChild } from '@angular/core';
import { DataService } from '../../providers/data.service';
import { SaConsultaPage } from '../sa-consulta/sa-consulta';
import { SolicitudAtencionPage } from '../solicitud-atencion/solicitud-atencion';
import { AuthService } from '../../providers/auth.service';
import { ChangeDetectorRef } from '@angular/core';
/**
 * Generated class for the SaLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa-location',
  templateUrl: 'sa-location.html',
})
export class SaLocationPage {

  @ViewChild(NavigatorPage) menu : NavigatorPage;

  profileForm = new FormGroup({
    location: new FormControl('', Validators.required)
  })

  title = 'Solicitud de Atención';
  location:any;
  dataForm:any;
  socio: any;
  validationLocation:string = "";
  selectOptions: any;
  localidades:any
  constructor(public navCtrl: NavController,private cdRef:ChangeDetectorRef, public navParams: NavParams, public utils: Utils,public dataservice:DataService,public authService :AuthService, public loading:LoadingController) {
    let dataPage =  this.utils.getFormSolicitudAtencion();
    console.log("datos de esta sección 2: ", dataPage);
    //this.getLocation();
    this.getName();

    this.dataservice.validarSA("10000080").subscribe(data=>{
        
      this.localidades = data.localidades
      console.log(this.localidades)
    })


    this.selectOptions = {
      title: 'Localidad',
    };

  }
  ionViewWillEnter(){
    this.presentLoading();
  }

  ionViewDidLoad() {
    this.getBackData();//paso: agregar getBackData => 1
    this.menu.setArrowBack(true);
  }

  presentLoading() {
    const loader = this.loading.create({
      content: "Espere un momento por favor...",
      duration: 2000
    });
    loader.present();
  }
  getBackData(){
    console.log(" => DELETE",this.utils.getBackPage());
    if(this.utils.getBackPage()){

      let dataPage =  this.utils.getFormSolicitudAtencion();
      var count = 0 ;
      for (let i = 0; i < dataPage.length; i++) {
          count = count + 1;
      }
      this.validationLocation = dataPage[count-1].step2.location;//paso: cambiar variable => 2

      this.utils.deleteDataFormSolicitudAtencion();
      this.cdRef.detectChanges();
    }
  }

  get f() { return this.profileForm.controls; }

  getLocation(){
    this.location = [ 'Córdoba', 'Rosario', 'Funes' ];
  }

  getName(){
    this.socio = this.utils.getFormSolicitudAtencion()[0].step1.users;//paso: cambiar posiscion a 1 => 3
  }

  getDataContact() {
    this.gotoPage();
  }

  gotoPage(){
    // if(this.utils.getBackPage()) {
    //   this.utils.deleteDataFormSolicitudAtencion();
    //   this.cdRef.detectChanges();
    // }
    this.utils.backPage(false);//paso: agegar backpage => 4
    this.saveData();
    this.navCtrl.push( SaConsultaPage );
  }

  saveData(){
    this.dataForm = {
      "step2": this.profileForm.value
    }

    let arrayDataForm = this.utils.getFormSolicitudAtencion();

    this.utils.setFormSolicitudAtencion(this.dataForm,2);
  }

  previusPage() {
    this.navCtrl.setRoot( SolicitudAtencionPage );
  }

 ionViewWillLeave() {//paso: agregar  ionViewWillUnload => 5
   console.log("LOCATION getBackPage",this.utils.getBackPage());

   // this.utils.backPage(true);
 }
}
