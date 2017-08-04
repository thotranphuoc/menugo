import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  shop: iShop;
  shopList: iShop[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private afService: AngularFireService) {
      // this.shopList = this.afService.getList('Shops');
      // console.log(this.shopList)
      this.dbService.getListReturnPromise_ArrayOfData('Shops').then((res: iShop[])=>{
        this.shopList = res;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go2Shop(shop: iShop){
    this.navCtrl.setRoot('ShopPage', shop);
  }

}
