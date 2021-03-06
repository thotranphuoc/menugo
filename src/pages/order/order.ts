import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { DbService } from '../../services/db.service';

import { iShop } from '../../interfaces/shop.interface';
@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  USER_ID: string;
  SHOPS: iShop[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private dbService: DbService,
  ) {
    this.USER_ID = this.afAuth.auth.currentUser.uid;
    this.dbService.getListReturnPromise_ArrayOfKey('ActiveOrdersOfUser/' + this.USER_ID).then((SHOPs_ID: any[]) => {
      console.log(SHOPs_ID)
      this.SHOPS = [];
      SHOPs_ID.forEach(SHOP_ID => {
        this.dbService.getOneItemReturnPromise('Shops/' + SHOP_ID).then((SHOP: iShop) => {
          this.SHOPS.push(SHOP);
        })
      })
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  go2Shop(SHOP: iShop) {
    this.navCtrl.setRoot('ShopPage', { shop: SHOP });
  }

}
