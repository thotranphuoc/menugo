import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',

})
export class AdminPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,) {}


  go2OrderManager(){
    this.navCtrl.push('OrderManagerPage');
  }

  go2Statistic(){
    this.navCtrl.push('OrderStatisticPage');
  }

  go2DailyStatistic(){
    this.navCtrl.push('OrderDailyStatisticPage')
  }

  go2RangeStatistic(){
    this.navCtrl.push('OrderRangeStatisticPage');
  }
}