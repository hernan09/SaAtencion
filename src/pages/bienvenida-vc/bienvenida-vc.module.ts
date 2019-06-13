import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BienvenidaVcPage } from './bienvenida-vc';

@NgModule({
  declarations: [
    BienvenidaVcPage,
  ],
  imports: [
    IonicPageModule.forChild(BienvenidaVcPage),
  ],
})
export class BienvenidaVcPageModule {}
