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
  shopList: iShop[] = [];
  isBackable: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private afService: AngularFireService) {
      this.shopList = this.navParams.get('shops');
      if(typeof(this.shopList) !='undefined'){
        this.isBackable = true;
        console.log(this.shopList);
      }else{
        this.isBackable = false;
        this.shopList = [];
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  go2Shop(shop: iShop){
    this.navCtrl.setRoot('ShopPage', shop);
  }

  go2Map(){
    if(this.isBackable){
      this.navCtrl.pop();
    }else{
      this.navCtrl.setRoot('MapPage');
    }
  }

}
