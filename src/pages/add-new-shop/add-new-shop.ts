import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireService } from '../../services/af.service';
import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop',
  templateUrl: 'add-new-shop.html',
})
export class AddNewShopPage {
  tab1Root = 'AddNewShopTab1Page';
  tab2Root = 'AddNewShopTab2Page';
  tab3Root = 'AddNewShopTab3Page';
  tab4Root = 'AddNewShopTab4Page';

  shop: iShop;
  shopList: iShop[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afService: AngularFireService) {
    // this.shop = {
    //   id: 'shop1',
    //   location: { lat: 0, lng: 0},
    //   name: 'Highlands coffee',
    //   kind: 'cafe',
    //   address: '1 Le Duan, Q1, Saigon',
    //   image: 'http://vincom.com.vn/sites/default/files/2016-09/HighlandsCoffee_logo_11.jpg'
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopPage');
  }

  // onAddShop(){
  //   this.addShop(this.shop);
  // }

  // addShop(shop: iShop){
  //   this.afService.addItem2List('Shops', shop).then((res)=>{
  //     console.log(res);
  //   })
  // }

}
