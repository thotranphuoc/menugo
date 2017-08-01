import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AngularFireService } from '../../services/af.service';
import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';

import { iOrder } from '../../interfaces/order.interface';
import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  DATE: any = '2017/07/23';
  selectedDate: string = null;
  SHOPs: iShop[] =[];
  USER_ID: string ;
  SHOPS_ITEMS: any[] = [];
  SHOPS_ITEMS_ID : any[]= [];
  SHOPS_ORDERS: any[] =[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private localService: LocalService,
    private appService: AppService,
    private dbService: DbService,
    private afService: AngularFireService
  ) {

    this.USER_ID = this.localService.USER_ID;
    if(this.USER_ID == null) {
      if(this.afService.getAuth().auth.currentUser){
        this.USER_ID = this.afService.getAuth().auth.currentUser.uid;
      } else{
        this.showConfirm();
      }
    }
    this.DATE = this.appService.getCurrentDate();
    this.initGetYourOrder();
  }

  initGetYourOrder(){ 
    console.log(this.USER_ID, this.DATE); 
      this.localService.getSHOPs_ID(this.USER_ID, this.DATE).then((shop_id_list: string[])=>{
        console.log(shop_id_list);
        this.SHOPS_ITEMS = [];
        this.SHOPS_ITEMS_ID = [];
        shop_id_list.forEach(shop_id => {
          this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(shop_id).then((data: any)=>{
            console.log(data);
            this.SHOPS_ITEMS = this.SHOPS_ITEMS.concat(data.SHOP_ITEMS);
            this.SHOPS_ITEMS_ID = this.SHOPS_ITEMS_ID.concat(data.SHOP_ITEMS_ID);
          })
          .then(()=>{
            console.log(this.SHOPS_ITEMS);
            console.log(this.SHOPS_ITEMS_ID);
          })
          .then(()=>{
            this.getOrderDetail();
          })

          this.SHOPs = [];
          this.dbService.getOneItemReturnPromise('Shops/'+shop_id).then((shop: iShop)=>{
            this.SHOPs.push(shop);
          })
        });
        console.log(this.SHOPs);
    })
  }

  getOrderDetail(){
    console.log('Done init');
      this.localService.getORDERS_IDOfUser(this.USER_ID, this.DATE).then((data: any[])=>{
        console.log(data);
        this.SHOPS_ORDERS = [];
        data.forEach(orderID => {
          this.dbService.getOneItemReturnPromise(orderID).then((orderDetail: iOrder)=>{
            console.log(orderDetail);
            let ORDER_LIST_NEW = []
            orderDetail.ORDER_LIST.forEach((item: any) =>{
              let index = this.SHOPS_ITEMS_ID.indexOf(item.item);
              ORDER_LIST_NEW.push({item: this.SHOPS_ITEMS[index], amount: item.amount});
            })
            orderDetail['ORDER_LIST_NEW'] = ORDER_LIST_NEW;
            this.SHOPS_ORDERS.push(orderDetail);
          })
        });
        console.log(this.SHOPS_ORDERS);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourOrdersPage');
  }

  ionViewWillEnter(){
    this.selectedDate = this.appService.convertDateFormat1(this.DATE);
    this.initGetYourOrder();
  }

  go2OrderDetail(order: iOrder, i) {
    console.log(order, i);
    console.log(this.SHOPs);
    let res = null;
    this.SHOPs.forEach((SHOP)=>{
      if(SHOP.SHOP_ID=== order.ORDER_SHOP_ID){
        res = SHOP
      }
    })
    console.log(res);
    this.navCtrl.push('OrderDetailPage', {ORDER: order, SHOP: res });
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.initGetYourOrder();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Alert!',
      message: 'Please login to use this feature',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.push('AccountPage', {action: 'request-login'});
          }
        }
      ]
    });
    confirm.present();
  }
}