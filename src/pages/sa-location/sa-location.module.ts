import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaLocationPage } from './sa-location';

@NgModule({
  declarations: [
    SaLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(SaLocationPage),
  ],
})
export class SaLocationPageModule {}
