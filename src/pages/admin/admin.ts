import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { iOrder } from '../../interfaces/order.interface';
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  orders: iOrder[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService: DbService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  ionViewWillEnter(){
    let SHOP_ID = '-Kp98d8gamYNpWHiDAVf';
    let DATE = '2017/07/17'
    let URL = 'Order/Shop/'+SHOP_ID+'/'+ DATE;
    this.dbService.getListReturnPromise_ArrayOfData(URL)
    .then((res: iOrder[])=>{
      console.log(res)
      this.orders = res;
    })
  }

}
