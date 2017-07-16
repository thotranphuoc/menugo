import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
import { iItem } from '../../interfaces/item.interface';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  shop: iShop = null;
  items: iItem[];
  SHOP_ID: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService,
    private afService: AngularFireService) {
      this.shop = navParams.data;
      this.SHOP_ID = navParams.data.$key;
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  ionViewWillEnter(){
    this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/'+this.SHOP_ID)
    .then((items_key: string[])=>{
      console.log(items_key);
      this.items = [];
      items_key.forEach(key=>{
        this.dbService.getOneItemReturnPromise('Items/'+key)
        .then((item: iItem)=>{
          console.log(item);
          this.items.push(item);
        })
      })
    })

  }

  go2MenuItemAdd(){
    console.log(this.SHOP_ID);
    this.navCtrl.push('MenuItemAddPage',{ SHOP_ID: this.SHOP_ID});
  }



}
