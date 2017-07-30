import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { DbService } from '../../services/db.service';
import { LocalService } from '../../services/local.service';
import { GchartService } from '../../services/gchart.service'
import { iOrder } from '../../interfaces/order.interface';
import { iItem } from '../../interfaces/item.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-order-statistic',
  templateUrl: 'order-statistic.html',
})
export class OrderStatisticPage {
  DATE: string = '2017/07/29';
  selectedDate: string = null;
  SHOP_ID: string = '-Kp98d8gamYNpWHiDAVf';
  SHOP_ITEMS: iItem[] = [];
  SHOP_ITEMS_ID: string[] = [];
  ORDER_LISTS: any[] = [];
  ORDER_filter_list: any[] = [];
  finalSUM: any[] = [];
  DATA2CHART: any[] = [];
  TOTAL_PRICE: number =0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appService: AppService,
    private dbService: DbService,
    private localService: LocalService,
    private gchartService: GchartService
  ) {

    this.DATE = this.appService.getCurrentDate();
    this.SHOP_ITEMS = this.localService.SHOP_ITEMS;
    this.SHOP_ITEMS_ID = this.localService.SHOP_ITEMS_ID;
    if (this.SHOP_ITEMS_ID.length < 1) {
      console.log('SHOP_ITEMS, ID are not available yet. getting them...');
      this.localService.getSHOP_ITEMSnSHOP_ITEMS_ID(this.SHOP_ID)
        .then((data: any) => {
          this.SHOP_ITEMS = data.SHOP_ITEMS;
          this.SHOP_ITEMS_ID = data.SHOP_ITEMS_ID;
          console.log(this.SHOP_ITEMS, this.SHOP_ITEMS_ID);
        })
    }
    this.getSUMofDATE();
    // this.drawChart();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatisticPage');
  }

  getSUMofDATE() {
    this.getOrderList()
      // 1. get List of Order
      .then((ORDER_LISTS: any[]) => {
        console.log(ORDER_LISTS);
        this.ORDER_LISTS = ORDER_LISTS
      })
      // 2. get new list of Order with filter
      .then(() => {
        // console.log('DONE');
        // this.ORDER_filter_list = [];
        // this.ORDER_LISTS.forEach(ORDER_LIST => {
        //   let index = this.SHOP_ITEMS_ID.indexOf(ORDER_LIST.item);
        //   let item = {
        //     ID: ORDER_LIST.item,
        //     AMOUNT: ORDER_LIST.amount,
        //     NAME_LOC: this.SHOP_ITEMS[index].ITEM_NAME_LOCAL,
        //     NAME_EN: this.SHOP_ITEMS[index].ITEM_NAME_EN,
        //     SIZE: this.SHOP_ITEMS[index].ITEM_SIZE,
        //     PRICE: this.SHOP_ITEMS[index].ITEM_PRICE
        //   };
        //   this.ORDER_filter_list.push(item);
        // });
        // console.log(this.ORDER_filter_list);
        this.getORDERwithFilter();
      })
      // 3. get new list of order with sum
      .then(() => {
        return this.getFinalSUM().then((finalSum: any[]) => {
          this.finalSUM = finalSum;
        })
      })
      // 4. get totalprice & array of data for chart
      .then(() => {
        this.getTotalPrice();
        let DATA4CHART = this.getDATA4Chart(this.finalSUM);
        this.drawChart(DATA4CHART);
      })
  }

  getORDERwithFilter() {
    return new Promise((resolve, reject) => {
      this.ORDER_filter_list = [];
      this.ORDER_LISTS.forEach(ORDER_LIST => {
        let index = this.SHOP_ITEMS_ID.indexOf(ORDER_LIST.item);
        let item = {
          ID: ORDER_LIST.item,
          AMOUNT: ORDER_LIST.amount,
          NAME_LOC: this.SHOP_ITEMS[index].ITEM_NAME_LOCAL,
          NAME_EN: this.SHOP_ITEMS[index].ITEM_NAME_EN,
          SIZE: this.SHOP_ITEMS[index].ITEM_SIZE,
          PRICE: this.SHOP_ITEMS[index].ITEM_PRICE
        };
        this.ORDER_filter_list.push(item);
      });
      console.log(this.ORDER_filter_list);
      resolve(this.ORDER_filter_list);
    })
  }

  getTotalPrice(){
    this.TOTAL_PRICE = 0
    this.finalSUM.forEach((item: any)=>{
      this.TOTAL_PRICE += item.AMOUNT* item.PRICE
    })
    
  }

  getFinalSUM() {
    return new Promise((resolve, reject) => {
      let finalSUM = [];
      this.SHOP_ITEMS_ID.forEach(ITEM_ID => {
        let count = 0;
        let item = null;
        for (var index = 0; index < this.ORDER_filter_list.length; index++) {
          if (this.ORDER_filter_list[index].ID === ITEM_ID) {
            count += this.ORDER_filter_list[index].AMOUNT;
            item = this.ORDER_filter_list[index];
          }
        }
        if (item != null) {
          item['AMOUNT'] = count;
          finalSUM.push(item);
        }
      })
      console.log(finalSUM);
      resolve(finalSUM)
      // let finalArray: any[] = [];
      // this.finalSUM.forEach((item: any) => {
      //   finalArray.push([item.NAME_EN, item.AMOUNT * item.PRICE]);
      // })
      // console.log(finalArray);
      // this.DATA2CHART = finalArray;
      // this.drawChart();
    })
  }

  getDATA4Chart(array: any) {
    let DATA2CHART: any[] = [];
    array.forEach((item: any) => {
      DATA2CHART.push([item.NAME_EN, item.AMOUNT * item.PRICE]);
    })
    console.log(DATA2CHART);
    return DATA2CHART;
  }

  getOrderList() {
    return new Promise((resolve, reject) => {
      let DATE = this.DATE;
      let SHOP_ID = this.SHOP_ID;
      let URL = 'OrdersOfShop/' + SHOP_ID + '/' + DATE;
      this.dbService.getListReturnPromise_ArrayOfData(URL).then((ORDERS: iOrder[]) => {
        // console.log(ORDERS);
        let ORDER_LISTS = [];
        ORDERS.forEach(ORDER => {
          // console.log(ORDER.ORDER_LIST);
          ORDER_LISTS = ORDER_LISTS.concat(ORDER.ORDER_LIST);
        })
        // console.log(ORDER_LISTS);
        resolve(ORDER_LISTS);
      })
    })
  }

  selectDate() {
    console.log(this.selectedDate);
    if (this.selectedDate != null) {
      this.DATE = this.selectedDate.substr(0, 4) + '/' + this.selectedDate.substr(5, 2) + '/' + this.selectedDate.substr(8, 2);
    } else {
      this.appService.alertMsg('Alert', 'Choose date to show');
    }
    console.log(this.DATE);
    this.getSUMofDATE();
  }

  drawChart(DATA2CHART) {
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
      let chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));
      // second chart
      let chart3 = new google.visualization.BarChart(document.getElementById('chart_div3'));
      let DATAS = DATA2CHART;
      this.gchartService.drawChart('Total on ' + this.DATE, 320, 300, DATAS).then((res: any) => {
        chart2.draw(res.data, res.options);
        chart3.draw(res.data, res.options);
      })


    })
  }

}
