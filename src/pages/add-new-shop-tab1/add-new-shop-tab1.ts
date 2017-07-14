import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab1',
  templateUrl: 'add-new-shop-tab1.html',
})
export class AddNewShopTab1Page {
  shop: iShop;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService) {
    this.shop = this.localService.getShop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab1Page');
  }
}
