import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaResumenPage } from './sa-resumen';

@NgModule({
  declarations: [
    SaResumenPage,
  ],
  imports: [
    IonicPageModule.forChild(SaResumenPage),
  ],
})
export class SaResumenPageModule {}
