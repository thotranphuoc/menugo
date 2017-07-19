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
  selector: 'page-shop-order',
  templateUrl: 'shop-order.html',
})
export class ShopOrderPage {
  itemIndex: any[];
  items: iItem[];
  orders: any[] = [];
  ORDERS: any[] = [];
  SHOP_ITEMS: iItem[] = null;
  SHOP_ITEMS_ID: string[] = null;

  test: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {

    // this.getTodayOrder();
    this.getShopItems().then(() => {
      // this.getTodayOrder();
      this.getTodayOrderAsync();
    });

    // this.getShopItemAsync().then(()=>{
    //   console.log(this.SHOP_ITEMS);
    //   console.log(this.SHOP_ITEMS_ID);
    //   this.getTodayOrderAsync();
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopOrderPage');
  }

  ionViewWillEnter() {
    this.itemIndex = this.localService.ITEM_INDEX;
    this.items = this.localService.ITEMS;
    console.log(this.itemIndex, this.items);
  }

  ionViewWillLeave() {
    this.localService.ITEM_INDEX = this.itemIndex;
  }

  subtract(i: number) {
    if (this.itemIndex[i].count > 0) {
      this.itemIndex[i].count--;
    }
  }

  add(i: number) {
    this.itemIndex[i].count++;
  }

  sendOrder() {
    let ORDER_LIST: iOrderList[] = [];
    this.itemIndex.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.items[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    let SHOP_ID = this.items[0].ITEM_SHOP_ID;
    let USER_ID = this.afService.getAuth().auth.currentUser.uid;
    let DATETIME = this.appService.getCurrentDataAndTime();
    let TABLE = 'T01';
    let ORDER: iOrder = {
      ORDER_ID: null,
      ORDER_SHOP_ID: SHOP_ID,
      ORDER_USER_ID: USER_ID,
      ORDER_STAFT_ID: USER_ID,
      ORDER_STATUS: 'SENDING',
      ORDER_DATE_CREATE: DATETIME,
      ORDER_DATE_CLOSE: null,
      ORDER_TABLE: TABLE,
      ORDER_LIST: ORDER_LIST,
    };

    let DATE = this.appService.getCurrentDate();

    // // insert order into Orders/ORDER_ID, then update OrdersOfShop, OrdersOfUser
    // this.afService.addItem2List('Orders/', ORDER).then((res) => {
    //   let ORDER_ID = res.key;
    //   // update OrdersOfShop
    //   this.dbService.insertValueIntoArray('OrdersOfShop/' + SHOP_ID + '/' + DATE, ORDER_ID)
    //   // update OrdersOfUser
    //   this.dbService.insertValueIntoArray('OrdersOfUser/' + USER_ID + '/' + DATE, ORDER_ID)
    // })

    this.afService.addItem2List('OrdersOfShop/' + SHOP_ID + '/' + DATE, ORDER)
      .then((res) => {
        // update ITEM_ID
        let ORDER_ID = res.key;
        this.afService.updateObjectData('OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID + '/ORDER_ID', ORDER_ID)
          .then((res) => {
            console.log('Order sending success');
            // update OrderOfUser
            this.dbService.insertValueIntoArray('OrdersOfUser/' + USER_ID + '/' + DATE, 'OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID)
          })

      })

  }

  getShopItems() {
    return new Promise((resolve, reject) => {
      this.SHOP_ITEMS = [];
      this.SHOP_ITEMS_ID = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + SHOP_ID)
        .then((item_keys: string[]) => {
          console.log(item_keys);
          item_keys.forEach(item_key => {
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
    return new Promise((resolve, reject) => {
      this.SHOP_ITEMS = [];
      this.SHOP_ITEMS_ID = [];
      let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
      this.afService.getList('Shop_Items/' + SHOP_ID).subscribe((item_keys: string[]) => {
        console.log(item_keys);
        item_keys.forEach((item_key: any) => {
          console.log(item_key.$value);
          this.afService.getObject('Items/'+item_key.$value).subscribe((item: iItem) => {
            console.log(item);
            this.SHOP_ITEMS.push(item);
            this.SHOP_ITEMS_ID.push(item.ITEM_ID);
            resolve();
          })
        })
      })
    })
  }

  getTodayOrder() {
    this.orders = [];
    let USER_ID = this.afService.getAuth().auth.currentUser.uid;
    let DATE = this.appService.getCurrentDate();
    let URL = 'OrdersOfUser/' + USER_ID + '/' + DATE;
    this.dbService.getListReturnPromise_ArrayOfData(URL).then((ORDER_ID_LIST: string[]) => {
      console.log(ORDER_ID_LIST);
      this.ORDERS = [];
      ORDER_ID_LIST.forEach(ORDER_ID => {
        this.dbService.getOneItemReturnPromise(ORDER_ID).then((ORDER_DATA: iOrder) => {
          console.log(ORDER_DATA);
          let ORDER_LIST_NEW = [];
          ORDER_DATA.ORDER_LIST.forEach(ORDER => {
            // this.dbService.getOneItemReturnPromise('Items/'+ORDER.item).then((res)=>{
            //   console.log(res)
            // })
            let index = this.SHOP_ITEMS_ID.indexOf(ORDER.item);
            ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: ORDER.amount });
          })
          ORDER_DATA['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
          this.ORDERS.push(ORDER_DATA);
        })
      });
    })
  }

  getTodayOrderAsync(){
    let USER_ID = this.afService.getAuth().auth.currentUser.uid;
    let DATE = this.appService.getCurrentDate();
    let URL = 'OrdersOfUser/' + USER_ID + '/' + DATE;

    this.afService.getList(URL).subscribe((ORDER_ID_LIST: string[])=>{
      console.log(ORDER_ID_LIST);
      // console.log()
      this.ORDERS = [];
      ORDER_ID_LIST.forEach((ORDER_ID: any) =>{
        this.afService.getObject(ORDER_ID.$value).subscribe((ORDER_DATA: iOrder)=>{
          console.log(ORDER_DATA);
          let ORDER_LIST_NEW = [];
          ORDER_DATA.ORDER_LIST.forEach(ORDER=>{
            let index = this.SHOP_ITEMS_ID.indexOf(ORDER.item);
            ORDER_LIST_NEW.push({item: this.SHOP_ITEMS[index], amount: ORDER.amount});
          })
          ORDER_DATA['ORDER_LIST_NEW']=ORDER_LIST_NEW;
          this.ORDERS.push(ORDER_DATA);
        })
      })
    })
  }


}
