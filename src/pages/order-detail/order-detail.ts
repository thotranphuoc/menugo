import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { AppService } from '../../services/app.service';
import { iOrder } from '../../interfaces/order.interface';
@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  order: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private appService: AppService
  ) {
    this.order = this.navParams.data;
    console.log(this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  setOrderStatus(NEW_STATUS){
    let ORDER: iOrder = this.order;
    // let DATE = this.appService.getCurrentDate();
    let DATE = ORDER.ORDER_DATE_CREATE.substr(0,10);
    this.localService.setNewStatusForOrder(ORDER.ORDER_SHOP_ID, ORDER.ORDER_USER_ID, NEW_STATUS, ORDER.ORDER_ID, DATE);
    this.order.ORDER_STATUS = NEW_STATUS;
  }

}
