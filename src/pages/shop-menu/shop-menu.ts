import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';

@IonicPage()
@Component({
  selector: 'page-shop-menu',
  templateUrl: 'shop-menu.html',
})
export class ShopMenuPage {
  shop: iShop = null;
  items: iItem[];
  itemIndex: any;
  SHOP_ID: string;
  SHOP_ITEMS: any[] = [];
  SHOP_ITEMS_ID: any[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private afService: AngularFireService,
    private localService: LocalService
  ) {
    this.shop = navParams.data;
    this.SHOP_ID = navParams.data.$key;
    console.log(this.shop, this.SHOP_ID);
    // this.getShopItems();
    // console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
    this.getShopItems().then(()=>{
      console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID, this.SHOP_ITEMS_INDEX);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopMenuPage');
    this.getItems();
  }

  ionViewWillEnter() {
    this.itemIndex = this.localService.ITEM_INDEX;
    this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
  }

  getItems() {
    this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + this.SHOP_ID)
      .then((items_key: string[]) => {
        console.log(items_key);
        this.items = [];
        this.itemIndex = [];
        items_key.forEach(key => {
          this.dbService.getOneItemReturnPromise('Items/' + key)
            .then((item: iItem) => {
              console.log(item);
              this.itemIndex.push({ count: 0 })
              this.items.push(item);
            })
        })
      })
    // .then(()=>{
    //   this.items.forEach(item =>{

    //   })
    // })
  }

  getShopItems() {
    return new Promise((resolve, reject) => {
      this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + this.shop.SHOP_ID)
        .then((ITEMS_KEY: string[]) => {
          this.SHOP_ITEMS_ID = ITEMS_KEY;
          this.SHOP_ITEMS = [];
          this.SHOP_ITEMS_INDEX = [];
          let n = this.SHOP_ITEMS_ID.length;
          let m =0;
          this.SHOP_ITEMS_ID.forEach(KEY => {
            this.dbService.getOneItemReturnPromise('Items/' + KEY)
              .then((item: iItem) => {
                console.log(item);
                this.SHOP_ITEMS.push(item);
                this.SHOP_ITEMS_INDEX.push({ count: 0 });
                m++;
                if(m==n){
                  resolve();
                }
              })
          })
        })
    })
  }

  go2MenuItemAdd() {
    console.log(this.SHOP_ID);
    this.navCtrl.push('MenuItemAddPage', { SHOP_ID: this.SHOP_ID });
  }

  selectItem(i) {
    console.log(i);
    this.itemIndex[i].count++;
  }

  selectITEM(i) {
    console.log(i);
    this.SHOP_ITEMS_INDEX[i].count++;
  }

  ionViewWillLeave() {
    this.localService.ITEM_INDEX = this.itemIndex;
    this.localService.ITEMS = this.items;

    this.localService.SHOP_ITEMS = this.SHOP_ITEMS;
    this.localService.SHOP_ITEMS_ID = this.SHOP_ITEMS_ID;
    this.localService.SHOP_ITEMS_INDEX = this.SHOP_ITEMS_INDEX;
  }

}
