import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  shop: iShop;
  shopList: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afService: AngularFireService) {
      this.shopList = this.afService.getList('Shops');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go2Shop(shop: iShop){
    this.navCtrl.push('ShopPage', shop);
  }

}
