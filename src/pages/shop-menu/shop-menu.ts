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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopMenuPage');
    this.getItems();
  }

  ionViewWillEnter(){
    this.itemIndex = this.localService.ITEM_INDEX;
  }

  getItems(){
    this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/'+this.SHOP_ID)
    .then((items_key: string[])=>{
      console.log(items_key);
      this.items = [];
      this.itemIndex = [];
      items_key.forEach(key=>{
        this.dbService.getOneItemReturnPromise('Items/'+key)
        .then((item: iItem)=>{
          console.log(item);
          this.itemIndex.push({count: 0})
          this.items.push(item);
        })
      })
    })
    // .then(()=>{
    //   this.items.forEach(item =>{

    //   })
    // })
  }

  go2MenuItemAdd(){
    console.log(this.SHOP_ID);
    this.navCtrl.push('MenuItemAddPage',{ SHOP_ID: this.SHOP_ID});
  }

  selectItem(i){
    console.log(i);
    this.itemIndex[i].count ++;  
  }

  ionViewWillLeave(){
    this.localService.ITEM_INDEX = this.itemIndex;
    this.localService.ITEMS = this.items;
  }

}
