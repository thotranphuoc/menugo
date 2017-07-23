import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';
import { Subscription } from 'rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-shop-order',
  templateUrl: 'shop-order.html',
})
export class ShopOrderPage {
  itemIndex: any[] = ['test'];
  items: iItem[];
  orders: any[] = [];
  ORDERS: any[] = [];
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  // isNEW: boolean = false;
  isItemUPDATE: boolean = false;
  isItemNEW: boolean = false;
  // ORDERs_DETAIL: any[] = [];
  ORDERs_NEW = [];
  // for unsubcribe
  subscription: Subscription;
  isNew: boolean = true;
  isItemNew: boolean = false;
  isItemUpdate: boolean = false;
  isOrderSent: boolean = false;
  Order2Update: iOrder = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    // this.checkItemNewOrUpdate();
    
    this.getShopITEMS();

    // this.getShopItems()
    // .then(() => {
    //   console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
    //   // get active order detail async
    //   this.getActiveOrderAsync();
    //   this.checkItemNewOrUpdate();
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopOrderPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ShopOrderPage');
    this.getShopITEMS();
    this.itemIndex = this.localService.ITEM_INDEX;
    this.items = this.localService.ITEMS;
    console.log(this.itemIndex, this.items);
    // TODO: remove item that have itemIndex.count = 0;
    // Enable button if count >0
    // this.checkIfItemAdded();
    // this.checkItemNewOrUpdate();

    this.checkItemNEWorUPDATE();
    this.getActiveOrderAsync();
  }

  ionViewWillLeave() {
    this.localService.ITEM_INDEX = this.itemIndex;
    this.subscription.unsubscribe();
  }

  checkItemNEWorUPDATE() {
    let count: number = 0;
    this.SHOP_ITEMS_INDEX.forEach(item => {
      count += item.count;
    })
    if (count > 0 && !this.isItemUPDATE) {
      this.isItemNEW = true;
    } else if (count > 0 && this.isItemUPDATE) {
      this.isItemNEW = false;
    }

    console.log(this.isItemNEW, this.isItemUPDATE);
  }

  // checkItemNewOrUpdate() {
  //   console.log(this.itemIndex);
  //   if (this.itemIndex.length > 0) {
  //     let count = this.countItems();
  //     if (count > 0) {
  //       if (this.isItemUpdate) {
  //         this.isItemNew = false;
  //       } else {
  //         this.isItemNew = true;
  //       }
  //       // if (this.itemIndex.length > 0 && !this.isItemUpdate) {
  //       //   this.isItemNew = true;
  //       // } else {
  //       //   this.isItemNew = false;
  //       // }

  //       // if (this.itemIndex.length > 0 && this.isItemUpdate) {
  //       //   this.isItemNew = false;
  //       //   this.isItemUpdate = true;
  //       // } else {
  //       //   // this.isItemNew = true;
  //       //   this.isItemUpdate = false;
  //       // }
  //     } else {
  //       this.isItemNew = false;
  //       this.isItemUpdate = false;
  //     }
  //   } else {
  //     this.isItemNew = false;
  //     this.isItemUpdate = false;
  //   }

  //   console.log(this.isItemNew, this.isItemUpdate);
  // }

  countItems() {
    let count = 0;
    if (this.itemIndex.length > 0) {
      this.itemIndex.forEach(item => {
        count += item.count;
      })
    }
    return count;
  }

  subtract(i: number) {
    if (this.itemIndex[i].count > 0) {
      this.itemIndex[i].count--;
    }
    if (this.SHOP_ITEMS_INDEX[i]) {
      this.SHOP_ITEMS_INDEX[i].count--;
    }
    // this.checkItemNewOrUpdate();
    this.checkItemNEWorUPDATE()
    // if (!this.isNew) {
    //   this.isItemNew = false;
    //   this.isItemUpdate = true;
    // }
  }

  add(i: number) {
    this.itemIndex[i].count++;
    this.SHOP_ITEMS_INDEX[i].count++;
    // this.checkItemNewOrUpdate();
    this.checkItemNEWorUPDATE();
    // if (!this.isNew) {
    //   this.isItemNew = false;
    //   this.isItemUpdate = true;
    // }
  }

  // sendOrder() {
  //   let ORDER_LIST: iOrderList[] = [];
  //   this.itemIndex.forEach((element, index: number, array) => {
  //     if (element.count > 0) {
  //       ORDER_LIST.push({ item: this.items[index].ITEM_ID, amount: element.count });
  //     }
  //   });
  //   console.log(ORDER_LIST);
  //   let SHOP_ID = this.items[0].ITEM_SHOP_ID;
  //   let USER_ID = this.afService.getAuth().auth.currentUser.uid;
  //   let DATETIME = this.appService.getCurrentDataAndTime();
  //   let TABLE = 'T01';
  //   let ORDER: iOrder = {
  //     ORDER_ID: null,
  //     ORDER_SHOP_ID: SHOP_ID,
  //     ORDER_USER_ID: USER_ID,
  //     ORDER_STAFT_ID: USER_ID,
  //     ORDER_STATUS: 'SENDING',
  //     ORDER_DATE_CREATE: DATETIME,
  //     ORDER_DATE_CLOSE: null,
  //     ORDER_TABLE: TABLE,
  //     ORDER_LIST: ORDER_LIST,
  //   };
  //   let DATE = this.appService.getCurrentDate();
  //   this.afService.addItem2List('OrdersOfShop/' + SHOP_ID + '/' + DATE, ORDER)
  //     .then((res) => {
  //       // update ITEM_ID
  //       let ORDER_ID = res.key;
  //       this.afService.updateObjectData('OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID + '/ORDER_ID', ORDER_ID)
  //         .then((resp) => {
  //           console.log('Order sending success');
  //           this.isOrderSent = true;
  //           this.isNew = false;
  //           this.isItemNew = false;
  //           this.Order2Update = ORDER;
  //           // update OrderOfUser
  //           this.dbService.insertValueIntoArray('OrdersOfUser/' + USER_ID + '/' + DATE, 'OrdersOfShop/' + SHOP_ID + '/' + DATE + '/' + ORDER_ID)
  //         })

  //       // insert ActiveOrdersOfUser
  //       let ActiveORDER = ORDER
  //       ActiveORDER['ORDER_ID'] = ORDER_ID;
  //       this.dbService.insertAnObjectAtNode('ActiveOrdersOfUser/' + USER_ID + '/' + ORDER_ID, ActiveORDER).then((res) => console.log('active orders of user updated'));
  //     })
  // }

  sendORDER() {
    
    let ORDER_LIST: iOrderList[] = [];
    this.SHOP_ITEMS_INDEX.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.SHOP_ITEMS[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    let SHOP_ID = this.SHOP_ITEMS[0].ITEM_SHOP_ID;
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
    this.localService.sendNewOrder(ORDER, SHOP_ID, USER_ID, DATE);
    this.Order2Update = ORDER;
    this.resetIndex();
  }

  resetIndex(){
    this.SHOP_ITEMS_INDEX.forEach(item=>{
      item.count = 0;
    })
    this.localService.SHOP_ITEMS_INDEX = this.SHOP_ITEMS_INDEX;
    this.setAction('init-load');
  }

  // updateOrder() {
  //   this.isItemNew = false;
  //   this.isItemUpdate = false;

  //   let ORDER_LIST: iOrderList[] = [];
  //   this.itemIndex.forEach((element, index: number, array) => {
  //     if (element.count > 0) {
  //       ORDER_LIST.push({ item: this.items[index].ITEM_ID, amount: element.count });
  //     }
  //   });
  //   console.log(ORDER_LIST);
  //   console.log(this.Order2Update);

  //   this.Order2Update.ORDER_LIST = ORDER_LIST;
  //   this.Order2Update.ORDER_STATUS = 'UPDATED';
  //   let DATE = this.Order2Update.ORDER_DATE_CREATE.substr(0, 10);
  //   // update OrdersOfShop
  //   this.afService.updateObjectData('OrdersOfShop/' + this.Order2Update.ORDER_SHOP_ID + '/' + DATE + '/' + this.Order2Update.ORDER_ID, this.Order2Update)
  //   // update ActiveOrdersOfUser
  //   this.afService.updateObjectData('ActiveOrdersOfUser/' + this.Order2Update.ORDER_USER_ID + '/' + this.Order2Update.ORDER_ID, this.Order2Update)
  // }

  updateORDER() {
    this.setAction('init-load');

    let ORDER_LIST: iOrderList[] = [];
    this.SHOP_ITEMS_INDEX.forEach((element, index: number, array) => {
      if (element.count > 0) {
        ORDER_LIST.push({ item: this.SHOP_ITEMS[index].ITEM_ID, amount: element.count });
      }
    });
    console.log(ORDER_LIST);
    console.log(this.Order2Update);
    this.localService.updateOrder(ORDER_LIST, this.Order2Update);
    
    this.resetIndex();
  }

  // // VERIFIED: get array of item_id & array of item-data
  // getShopItems() {
  //   return new Promise((resolve, reject) => {
  //     this.SHOP_ITEMS = [];
  //     this.SHOP_ITEMS_ID = [];
  //     let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
  //     // get all item_id of user on today
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

  getShopITEMS() {
    this.SHOP_ITEMS = this.localService.SHOP_ITEMS;
    this.SHOP_ITEMS_ID = this.localService.SHOP_ITEMS_ID;
    this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
    console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_INDEX, this.SHOP_ITEMS_ID);
  }

  // VERIFIED: get Active orders of user
  getActiveOrderAsync() {
    let USER_ID = this.afService.getAuth().auth.currentUser.uid;
    let URL = 'ActiveOrdersOfUser/' + USER_ID
    this.subscription = this.afService.getList(URL).subscribe((ORDERS: iOrder[]) => {
      console.log(ORDERS);
      if (ORDERS.length > 0) {
        this.ORDERs_NEW = [];
        ORDERS.forEach(ORDER => {
          let ORDER_LIST_NEW = [];
          let TOTAL_PRICE = 0;
          if (ORDER.ORDER_LIST.length > 0) {
            ORDER.ORDER_LIST.forEach(item => {
              let index = this.SHOP_ITEMS_ID.indexOf(item.item);
              ORDER_LIST_NEW.push({ item: this.SHOP_ITEMS[index], amount: item.amount });
              let PRICE = item.amount*this.SHOP_ITEMS[index].ITEM_PRICE;
              TOTAL_PRICE +=PRICE;
            })
          }
          setTimeout(() => {
            ORDER['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
            ORDER['TOTAL_PRICE'] = TOTAL_PRICE;
            this.ORDERs_NEW.push(ORDER);
          }, 1000)
        })
      }
    })
  }

  go2OrderUpdate(order, ind) {
    this.setAction('update');
    // this.navCtrl.push('ShopOrderUpdatePage', order);
    console.log(this.SHOP_ITEMS_ID, this.SHOP_ITEMS_INDEX);
    this.updateIndexCount(order).then((res: any[]) => {
      console.log(res)
      this.localService.SHOP_ITEMS_INDEX = res;
      this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
    })
    delete order.ORDER_LIST_NEW;
    this.Order2Update = order;
    
  }

  updateIndexCount(order: iOrder) {
    return new Promise((resolve, reject) => {
      let IDs = order.ORDER_LIST.map(item => item.item);
      let shop_items_id = this.SHOP_ITEMS_ID;
      let shop_items_index = [];
      shop_items_id.forEach(item => {
        let ind = IDs.indexOf(item);
        if (ind < 0) {
          shop_items_index.push({ count: 0 });
        } else {
          shop_items_index.push({ count: order.ORDER_LIST[ind].amount });
        }
      })
      console.log(shop_items_index);
      resolve(shop_items_index);
    })

  }

  setAction(action: string){
    switch (action) {
      case 'new':
        this.isItemNEW = true;
        this.isItemUPDATE = false;
        break;
      case 'update':
        this.isItemNEW = false;
        this.isItemUPDATE = true;
        break;
      case 'init-load':
        this.isItemNEW = false;
        this.isItemUPDATE = false;
      default:
        break;
    }

    console.log(this.isItemNEW, this.isItemUPDATE);
  }

  

}
