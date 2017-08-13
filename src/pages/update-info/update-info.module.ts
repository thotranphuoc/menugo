import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateInfoPage } from './update-info';

@NgModule({
  declarations: [
    UpdateInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateInfoPage),
  ],
  exports: [
    UpdateInfoPage
  ]
})
export class UpdateInfoPageModule {}
