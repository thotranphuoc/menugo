import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-admin-board',
  templateUrl: 'admin-board.html',
})
export class AdminBoardPage {
  data: any;
  SHOP: iShop;
  USER_ID: string;
  PROFILE: iProfile;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.USER_ID = this.data.USER_ID;
    this.SHOP = this.data.SHOP;
    this.PROFILE = this.data.PROFILE;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminBoardPage');
  }

  go2OrderManager(){
    this.navCtrl.push('OrderManagerPage',{SHOP_ID: this.SHOP.SHOP_ID});
  }

  go2Statistic(){
    this.navCtrl.push('OrderStatisticPage',{SHOP_ID: this.SHOP.SHOP_ID});
  }

  go2DailyStatistic(){
    this.navCtrl.push('OrderDailyStatisticPage',{SHOP_ID: this.SHOP.SHOP_ID})
  }

  go2RangeStatistic(){
    this.navCtrl.push('OrderRangeStatisticPage',{SHOP_ID: this.SHOP.SHOP_ID});
  }

  go2StaffManager(){
    this.navCtrl.push('StaffManagerPage',this.data);
  }

  go2UpdateInfo(){
    console.log('Update informatio');
    this.navCtrl.push('UpdateInfoPage', {SHOP: this.SHOP, USER_ID: this.USER_ID, PROFILE: this.PROFILE});
  }

}
