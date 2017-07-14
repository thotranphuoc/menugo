import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  shop: iShop = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.shop = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

}
