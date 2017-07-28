import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { iItem } from '../../interfaces/item.interface';
import { iOrderList } from '../../interfaces/order-list.interface';
import { iOrder } from '../../interfaces/order.interface';
import { iShop } from '../../interfaces/shop.interface';
import { Subscription } from 'rxjs/Subscription';
@IonicPage()
@Component({
  selector: 'page-shop-order',
  templateUrl: 'shop-order.html',
})
export class ShopOrderPage {
  SHOP: iShop = null;
  USER_ID: string = null;

  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  SHOP_ITEMS_INDEX: any[] = [];
  isItemUPDATE: boolean = false;
  isItemNEW: boolean = false;
  ORDERs_NEW = [];
  // for unsubcribe
  subscription: Subscription;
  Order2Update: iOrder = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {
    this.SHOP = this.localService.SHOP;
    if (this.localService.USER_ID != null) {
      this.USER_ID = this.localService.USER_ID;
    } else {
      this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
    }

    // 1. getShopITEMS. If ITEM already get, go ahead. If not, start getting
    this.getShopITEMS();
    if (this.SHOP_ITEMS.length < 0) {
      // start get ShopITEM
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP.SHOP_ID).then((data: any) => {
        this.SHOP_ITEMS = data.SHOP_ITEMS;
        this.SHOP_ITEMS_ID = data.SHOP_ITEMS_ID;
      })
    }

    // 2. getActiveOrderAsync();
    this.getActiveOrderAsync();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopOrderPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ShopOrderPage');
    this.getShopITEMS();
    this.checkItemNEWorUPDATE();
  }

  ionViewWillLeave() {
    
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

  subtract(i: number) {
    if (this.SHOP_ITEMS_INDEX[i]) {
      this.SHOP_ITEMS_INDEX[i].count--;
    }
    this.checkItemNEWorUPDATE()
  }

  add(i: number) {
    // this.itemIndex[i].count++;
    this.SHOP_ITEMS_INDEX[i].count++;
    this.checkItemNEWorUPDATE();
  }

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


  resetIndex() {
    this.SHOP_ITEMS_INDEX.forEach(item => {
      item.count = 0;
    })
    this.localService.SHOP_ITEMS_INDEX = this.SHOP_ITEMS_INDEX;
    this.setAction('init-load');
  }

  getShopITEMS() {
    this.SHOP_ITEMS = this.localService.SHOP_ITEMS;
    this.SHOP_ITEMS_ID = this.localService.SHOP_ITEMS_ID;
    this.SHOP_ITEMS_INDEX = this.localService.SHOP_ITEMS_INDEX;
    console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_INDEX, this.SHOP_ITEMS_ID);
  }

  // VERIFIED: get Active orders of user
  getActiveOrderAsync() {
    let USER_ID = this.USER_ID;
    let SHOP_ID = this.SHOP.SHOP_ID;
    let URL = 'ActiveOrdersOfUser/' + USER_ID + '/' + SHOP_ID;
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
              let PRICE = item.amount * this.SHOP_ITEMS[index].ITEM_PRICE;
              TOTAL_PRICE += PRICE;
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

  updateSelectedORDER(order, ind) {
    this.setAction('update');
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
      // console.log(shop_items_index);
      resolve(shop_items_index);
    })

  }

  setAction(action: string) {
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
