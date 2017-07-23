import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { iOrder } from '../../interfaces/order.interface';
import { iItem } from '../../interfaces/item.interface';

import { Subscription } from 'rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  // orders: iOrder[] = [];
  // orders_new: any = [];
  ORDERs_NEW: any[] = [];

  // for unsubcribe
  subscription: Subscription
  DATE: any = '2017/07/23';
  selectedDate: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private afService: AngularFireService,
    private dbService: DbService,
    private localService: LocalService
  ) {
    this.DATE = this.appService.getCurrentDate();
    // this.getShopItems()
    //   .then(() => {
    //     this.getOrderDetailAsync();
    //   })

    this.getShopItems().then(() => {
      this.getOrderDetailAsync();
    })

    // this.dbService.getAnObjectAtNode('ActiveOrdersOfUser/1TS0NVs0ElX86MGAmHOKol9PFC82');
    // this.dbService.moveObjectFromURL2URL('ActiveOrdersOfUser/1TS0NVs0ElX86MGAmHOKol9PFC82','ActiveOrdersOfUserBK/1TS0NVs0ElX86MGAmHOKol9PFC82','-KpV8YMw1WU4CiXLxnoo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')

  }

  // // VERIFIED: get array of item_id & array of item_data
  // getShopItems() {
  //   return new Promise((resolve, reject) => {
  //     this.SHOP_ITEMS = [];
  //     this.SHOP_ITEMS_ID = [];
  //     let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
  //     // get all item_id of shop
  //     this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + SHOP_ID)
  //       .then((item_keys: string[]) => {
  //         console.log(item_keys);
  //         item_keys.forEach(item_key => {
  //           // from key, get item detail
  //           this.dbService.getOneItemReturnPromise('Items/' + item_key)
  //             .then((item: iItem) => {
  //               // console.log(item);
  //               this.SHOP_ITEMS.push(item);
  //               this.SHOP_ITEMS_ID.push(item.ITEM_ID)
  //               resolve();
  //             })
  //         })
  //       })
  //   })
  // }

  getShopItems() {
    return new Promise((resolve, reject) => {
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      this.localService.getShopItems_ID(SHOP_ID).then((items_id: string[]) => {
        console.log(items_id);
        this.localService.getItemDateFromListOfItems_ID(items_id).then((res: any) => {
          console.log(res);
          this.SHOP_ITEMS = res.SHOP_ITEMS;
          this.SHOP_ITEMS_ID = res.SHOP_ITEMS_ID;
          resolve();
        })
      })
    })
  }

  go2OrderDetail(order: iOrder, i) {
    console.log(order, i);
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    let DATE = this.appService.getCurrentDate();
    // let DATE = '2017/07/18';
    let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;
    this.navCtrl.push('OrderDetailPage', order);
  }


  // VERIFIED: get array of orders detail of show, async
  getOrderDetailAsync() {
    this.ORDERs_NEW = [];
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    let DATE = this.DATE;
    // let DATE = '2017/07/21';
    let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

    this.subscription = this.afService.getList(URL).subscribe((ORDERS: any[]) => {
      console.log(ORDERS);
      this.ORDERs_NEW = [];
      ORDERS.forEach((ORDER: iOrder) => {
        let ORDER_LIST_NEW = [];
        let TOTAL_PRICE = 0;
        ORDER.ORDER_LIST.forEach((item: any) => {
          // console.log(item);
          let index = this.SHOP_ITEMS_ID.indexOf(item.item);
          ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
          let PRICE = item.amount*this.SHOP_ITEMS[index].ITEM_PRICE;
          TOTAL_PRICE +=PRICE;
        })
        ORDER['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
        ORDER['TOTAL_PRICE'] = TOTAL_PRICE;
        this.ORDERs_NEW.push(ORDER)
      })
    })
  }

  ionViewWillLeave() {
    // this.subscription.unsubscribe();
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.getOrderDetailAsync();
  }

}
