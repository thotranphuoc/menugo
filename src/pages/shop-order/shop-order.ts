import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';

@IonicPage()
@Component({
  selector: 'page-shop-order',
  templateUrl: 'shop-order.html',
})
export class ShopOrderPage {
  itemIndex: any[];
  items: iItem[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService,
    private afService: AngularFireService
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopOrderPage');
  }

  ionViewWillEnter(){
    this.itemIndex = this.localService.ITEM_INDEX;
    this.items = this.localService.ITEMS;
    console.log(this.itemIndex, this.items);
  }

  ionViewWillLeave(){
    this.localService.ITEM_INDEX = this.itemIndex;
  }

  subtract(i: number){
    if(this.itemIndex[i].count>0){
      this.itemIndex[i].count --;
    }
  }

  add(i: number){
    this.itemIndex[i].count ++;
  }

  sendOrder(){
    let ORDER_LIST: iOrderList[] =[];
    this.itemIndex.forEach((element, index: number, array) => {
      if(element.count >0){
        ORDER_LIST.push({item: this.items[index].ITEM_ID, amount: element.count});
      }
    });
    console.log(ORDER_LIST);
    let SHOP_ID = this.items[0].SHOP_ID;
    let USER_ID = this.afService.getAuth().auth.currentUser.uid;
    let DATETIME = this.appService.getCurrentDataAndTime();
    let ORDER: iOrder = {
      ORDER_ID: null, 
      SHOP_ID: SHOP_ID,
      USER_ID: USER_ID,
      STAFT_ID: USER_ID,
      ORDER_STATUS: 'SENDING',
      ORDER_LIST: ORDER_LIST,
      DATE_CREATE: DATETIME,
      DATE_CLOSE: null
    };
    
    let DATE = this.appService.getCurrentDate();
    this.afService.addItem2List('Order/Shop/'+SHOP_ID+'/'+DATE,ORDER)
    .then((res)=>{
      // update ITEM_ID
      let ORDER_ID = res.key;
      this.afService.updateObjectData('Order/Shop/'+SHOP_ID+'/'+DATE+'/'+ORDER_ID+'/ORDER_ID',ORDER_ID)
      .then((res)=>{
        console.log('Order sending success');
        console.log(res);
      })
              
    })

  }

}
