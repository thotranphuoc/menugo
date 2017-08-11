import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-shop-menu',
  templateUrl: 'shop-menu.html',
})
export class ShopMenuPage {
  shop: iShop = null;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private dbService: DbService,
    private afService: AngularFireService,
    private localService: LocalService
  ) {
    this.shop = navParams.data;
    console.log(this.shop);
    this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.shop.SHOP_ID).then((res: any)=>{
      this.SHOP_ITEMS = res.SHOP_ITEMS;
      this.SHOP_ITEMS_ID = res.SHOP_ITEMS_ID;
      this.SHOP_ITEMS_INDEX =[];
      let l = this.SHOP_ITEMS_ID.length
      for (let index = 0; index < l; index++) {
        this.SHOP_ITEMS_INDEX.push({count: 0});
      }
      console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID, this.SHOP_ITEMS_INDEX);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopMenuPage');
  }

  ionViewWillEnter() {
    this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
  }

  go2MenuItemAdd() {
    console.log(this.shop.SHOP_ID);
    this.app.getRootNav().push('MenuItemAddPage', { SHOP_ID: this.shop.SHOP_ID });
  }

  selectITEM(i) {
    console.log(i);
    this.SHOP_ITEMS_INDEX[i].count++;
  }

  ionViewWillLeave() {
    this.localService.SHOP_ITEMS = this.SHOP_ITEMS;
    this.localService.SHOP_ITEMS_ID = this.SHOP_ITEMS_ID;
    this.localService.SHOP_ITEMS_INDEX = this.SHOP_ITEMS_INDEX;
  }
}
