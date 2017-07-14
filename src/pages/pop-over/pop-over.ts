import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {
  shop: iShop = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController) {
    this.shop = this.navParams.data;
    console.log(this.shop);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverPage');
  }

  closePopover() {
    this.viewCtrl.dismiss();
  }

  go2Shop() {
    console.log('go to detailed page');
    this.navCtrl.push('ShopPage', this.shop)
  }

}
