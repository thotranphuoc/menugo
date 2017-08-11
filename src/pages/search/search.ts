import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { iItem } from '../../interfaces/item.interface';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  countryList: any[] =[];
  itemList: iItem[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  private afDB: AngularFireDatabase) {

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

  }

  getItems(event){
    console.log(event.srcElement.value);
    let srcStr = event.srcElement.value.trim();
    if(srcStr){
      this.searchString(srcStr);
    }else{
      console.log('no string')
      this.itemList = [];
    }
  }

  searchString(searchStr: string){
    this.itemList =[];
    this.afDB.list('Items/').forEach((items:iItem[])=>{
      items.forEach(item => {
        if(item.ITEM_NAME_EN.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase())>=0){
          console.log(item);
          this.itemList.push(item);
        }else{
          if(item.ITEM_NAME_LOCAL.toLocaleLowerCase().indexOf(searchStr.toLocaleLowerCase())>=0){
            console.log(item);
            this.itemList.push(item);
          }
        }
      });      
    })
  }

  go2Shop(item: iItem){
    console.log(item);
    this.afDB.object('Shops/'+item.ITEM_SHOP_ID).forEach((shop)=>{
      console.log(shop);
      this.navCtrl.push('ShopPage', shop);
    })
  }

}
