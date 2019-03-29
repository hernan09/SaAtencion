import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaAddressPage } from './sa-address';

@NgModule({
  declarations: [
    SaAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(SaAddressPage),
  ],
})
export class SaAddressPageModule {}
