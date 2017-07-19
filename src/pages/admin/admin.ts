import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
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
  SHOP_ITEMS: iItem[] = null;
  SHOP_ITEMS_ID: string[] = null;
  orders: iOrder[] = [];
  orders_new: any = [];
  test: any[];
  amounts: any[] = [];

  // for unsubcribe
  subscription: Subscription
  ORDERs_NEW: any[] =[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private afService: AngularFireService,
    private dbService: DbService,
    
  ) {
    console.log('constructor');
    this.getShopItems()
      .then(() => {
        // this.getOrderDetail().then((res) => {
        //   console.log(res);
        //   this.orders_new = res;
        // })
        this.getOrderDetailAsync();
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
  }

  // VERIFIED: get array of item_id & array of item_data
  getShopItems() {
    return new Promise((resolve, reject) => {
      this.SHOP_ITEMS = [];
      this.SHOP_ITEMS_ID = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      // get all item_id of shop
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

  getShopItemAsync() {
    this.SHOP_ITEMS = [];
    this.SHOP_ITEMS_ID = [];
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    this.afService.getObject('Shop_Items/' + SHOP_ID).subscribe((data) => {
      this.test = data;
    })
    // .subscribe((res)=>{
    //   console.log(res);
    //   // console.log(res.json())
    // })
  }

  getOrders() {
    this.amounts = [];
    let orderIDs = [];
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    // let DATE = this.appService.getCurrentDate();
    let DATE = '2017/07/18';
    let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

    // get all order of shop within today.
    this.afService.getList(URL).subscribe((ORDER_LIST: any[]) => {
      console.log(ORDER_LIST);
      ORDER_LIST.forEach((ORDER) => {
        // console.log(ORDER);
        ORDER.ORDER_LIST.forEach(item => {
          console.log(item);
          this.amounts.push(item);
        })

        // this.afService.getObject('Items/'+ORDER.ORDER_LISitem).subscribe(item=>{
        //   console.log(item);
        // })
      })
    })
  }


  getShopOrders() {
    return new Promise((resolve, reject) => {
      let orderIDs = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      // let DATE = this.appService.getCurrentDate();
      let DATE = '2017/07/18';
      let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

      // get all order of shop in day
      this.dbService.getListReturnPromise_ArrayOfData(URL)
        .then((res: iOrder[]) => {
          this.orders_new = [];
          this.orders = res;
          this.orders.forEach(order => {
            let ORDER_LIST_new = [];
            order.ORDER_LIST.forEach(item => {
              let index = this.SHOP_ITEMS_ID.indexOf(item.item);
              // console.log(item.amount, this.SHOP_ITEMS[index]);
              ORDER_LIST_new.push({ item: this.SHOP_ITEMS[index], amount: item.amount })
            })
            let order_new = order;
            order_new['ORDER_LIST_new'] = ORDER_LIST_new;
            this.orders_new.push(order_new);
          })
          // console.log(this.orders);
          // console.log(this.orders_new);
        })
        .then(() => {
          resolve()
        })
    })
  }

  go2OrderDetail(order, i) {
    console.log(order, i);
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    let DATE = this.appService.getCurrentDate();
    let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;
    this.afService.updateObjectData(URL + '/' + order.ORDER_ID + '/ORDER_STATUS', 'READY')
      .then(() => {
        this.getShopOrders();
      })
  }

  // VERIFIED: Get the detail of Order. No Async
  getOrderDetail() {
    return new Promise((resolve, reject) => {
      let ORDERs_NEW = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      // let DATE = this.appService.getCurrentDate();
      let DATE = '2017/07/18';
      let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

      // get array of order of shop
      this.dbService.getListReturnPromise_ArrayOfData(URL)
        .then((datas: any[]) => {
          // console.log(datas);
          ORDERs_NEW = [];
          datas.forEach((data: iOrder) => {
            let ORDER_LIST_NEW = [];
            data.ORDER_LIST.forEach(item => {
              // console.log(item);
              let index = this.SHOP_ITEMS_ID.indexOf(item.item);
              ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
            })
            data['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
            ORDERs_NEW.push(data)
          })
        })
        .then(() => {
          // resolve
          resolve(ORDERs_NEW)
        })

      // this.afService.getList(URL).subscribe((datas)=>{
      //   // console.log(datas);
      //     ORDERs_NEW = [];
      //     datas.forEach((data: iOrder) => {
      //       let ORDER_LIST_NEW = [];
      //       data.ORDER_LIST.forEach(item => {
      //         // console.log(item);
      //         let index = this.SHOP_ITEMS_ID.indexOf(item.item);
      //         ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
      //       })
      //       data['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
      //       ORDERs_NEW.push(data)
      //     })
      // })
    })
  }

  getOrderDetailAsync(){
    this.ORDERs_NEW = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      // let DATE = this.appService.getCurrentDate();
      let DATE = '2017/07/18';
      let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;

      this.subscription = this.afService.getList(URL).subscribe((datas)=>{
        // console.log(datas);
          this.ORDERs_NEW = [];
          datas.forEach((data: iOrder) => {
            let ORDER_LIST_NEW = [];
            data.ORDER_LIST.forEach(item => {
              // console.log(item);
              let index = this.SHOP_ITEMS_ID.indexOf(item.item);
              ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
            })
            data['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
            this.ORDERs_NEW.push(data)
          })
      })
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

}
