import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';
// import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  shop: iShop = null;
  // items: iItem[];
  // SHOP_ID: string;
  SHOP_ITEMS: any[] =[];
  SHOP_ITEMS_ID: any[] =[];

  tab1Root = 'ShopMenuPage';
  tab2Root = 'ShopOrderPage';
  tab3Root = 'ShopBillPage';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbService: DbService,
    private localService: LocalService,
    // private afService: AngularFireService
  ) {
    this.shop = navParams.data;
    console.log(this.shop);
    this.localService.SHOP = this.shop;
    // this.SHOP_ID = navParams.data.$key;
    // this.getShopItems().then(()=>{
    //   this.localService.SHOP_ITEMS = this.SHOP_ITEMS;
    //   this.localService.SHOP_ITEMS_ID = this.SHOP_ITEMS_ID;
    // })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }


  // VERIFIED: get array of item_id & array of item-data
  getShopItems() {
    return new Promise((resolve, reject) => {
      this.SHOP_ITEMS = [];
      this.SHOP_ITEMS_ID = [];
      let SHOP_ID = this.shop.SHOP_ID;
      // get all item_id of user on today
      this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + SHOP_ID)
        .then((item_keys: string[]) => {
          console.log(item_keys);
          item_keys.forEach(item_key => {
            // from key, get item detail
            this.dbService.getOneItemReturnPromise('Items/' + item_key)
              .then((item: iItem) => {
                console.log(item);
                this.SHOP_ITEMS.push(item);
                this.SHOP_ITEMS_ID.push(item.ITEM_ID)
                resolve();
              })
          })
        })
    })
  }

  // ngOnInit(){
  //   this.navCtrl.push('ShopMenuPage', this.shop)
  // }

  // ionViewWillEnter(){
  //   this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/'+this.SHOP_ID)
  //   .then((items_key: string[])=>{
  //     console.log(items_key);
  //     this.items = [];
  //     items_key.forEach(key=>{
  //       this.dbService.getOneItemReturnPromise('Items/'+key)
  //       .then((item: iItem)=>{
  //         console.log(item);
  //         this.items.push(item);
  //       })
  //     })
  //   })

  // }

  // go2MenuItemAdd(){
  //   console.log(this.SHOP_ID);
  //   this.navCtrl.push('MenuItemAddPage',{ SHOP_ID: this.SHOP_ID});
  // }



}
