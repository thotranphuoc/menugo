import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';

@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  SHOP_ITEMS: iItem[] = null;
  SHOP_ITEMS_ID: string[] = null;
  ORDERs_DETAIL: any[] = [];

  DATE: any = '2017/07/23';
  selectedDate: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    this.DATE = this.appService.getCurrentDate();
    this.getHistory();

  }

  getHistory() {
    this.getShopItems().then(() => {
      console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
      this.getOrdersOfUser().then((ORDERs_ID: string[]) => {
        console.log(ORDERs_ID);
        this.getOrderDetailFromId(ORDERs_ID);
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourOrdersPage');
  }

  // VERIFIED: get array of item_id & array of item-data
  getShopItems() {
    return new Promise((resolve, reject) => {
      this.SHOP_ITEMS = [];
      this.SHOP_ITEMS_ID = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      // get all item_id of user on today
      this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + SHOP_ID)
        .then((item_keys: string[]) => {
          console.log(item_keys);
          item_keys.forEach(item_key => {
            // from key, get item detail
            this.dbService.getOneItemReturnPromise('Items/' + item_key)
              .then((item: iItem) => {
                // console.log(item);
                this.SHOP_ITEMS.push(item);
                this.SHOP_ITEMS_ID.push(item.ITEM_ID)
                resolve();
              })
          })
        })
    })
  }

  // VERIFIED: Get oder Ids of users
  getOrdersOfUser() {
    return new Promise((resolve, reject) => {
      let USER_ID = this.afService.getAuth().auth.currentUser.uid;
      let DATE = this.DATE;
      // let DATE = '2017/07/18';
      let URL = 'OrdersOfUser/' + USER_ID + '/' + DATE;
      this.dbService.getListReturnPromise_ArrayOfData(URL).then((ORDER_IDs) => {
        // console.log(ORDER_IDs);
        resolve(ORDER_IDs)
      })
    })
  }

  // VERIFIED: get array of Order detail from array of Order IDs
  getOrderDetailFromId(ORDER_IDs: string[]) {
    this.ORDERs_DETAIL = [];
    // console.log('ORDER_IDs',ORDER_IDs)
    ORDER_IDs.forEach(ORDER_ID => {
      this.dbService.getOneItemReturnPromise(ORDER_ID).then((orderDetail: iOrder) => {
        let ORDER_LIST_NEW = [];
        let TOTAL_PRICE = 0;
        orderDetail.ORDER_LIST.forEach(ORDER => {
          let index = this.SHOP_ITEMS_ID.indexOf(ORDER.item);
          ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: ORDER.amount });
          let PRICE = ORDER.amount * this.SHOP_ITEMS[index].ITEM_PRICE;
          TOTAL_PRICE += PRICE;
        })

        orderDetail['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
        orderDetail['TOTAL_PRICE'] = TOTAL_PRICE;
        this.ORDERs_DETAIL.push(orderDetail);
      })
    })
    console.log(this.ORDERs_DETAIL);

  }

  go2OrderDetail(order, i) {
    console.log(order, i);
    this.navCtrl.push('OrderDetailPage', order);
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.getHistory();
  }

}
