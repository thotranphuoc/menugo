import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, AlertController } from 'ionic-angular';

import { AppService } from '../../services/app.service';
import { LocalService } from '../../services/local.service';
import { GmapService } from '../../services/gmap.service';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';

import { iShop } from '../../interfaces/shop.interface';
import { iPosition } from '../../interfaces/position.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab4',
  templateUrl: 'add-new-shop-tab4.html',
})
export class AddNewShopTab4Page {
  SHOP_IMAGE: string = null;
  shop: iShop;
  mapreview: any;
  mapElement: any;
  loading: any;
  action: string = 'add-new';


  // Review & post
  isInfoFullFilled: boolean = true;
  hasPosted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private app: App,
    private alertCtrl: AlertController,
    private appService: AppService,
    private afService: AngularFireService,
    private gmapService: GmapService,
    private localService: LocalService,
    private dbService: DbService) {
    this.shop = this.localService.getShop();
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab4Page');
  }

  ionViewWillEnter() {
    this.SHOP_IMAGE = this.localService.SHOP_IMAGE;
    this.shop = this.localService.getShop();
    console.log(this.localService.SHOP.LOCATION);

    setTimeout(() => {
      if (this.shop.LOCATION) {
        this.initMap(this.shop.LOCATION)
      } else {
        this.initMap({ lat: 0, lng: 0 })
      }
    }, 1000)
  }

  initMap(position: iPosition) {
    let mapElement = document.getElementById('mapreview');
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOption = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.gmapService.initMap(mapElement, mapOption)
      .then((map) => {
        this.mapreview = map;
        this.gmapService.addMarkerToMap(this.mapreview, position).then((marker) => {
          // this.userMarker = marker;
        })
      })
  }

  createShop() {
    this.hasPosted = true;
    console.log(this.shop);
    this.checkInfoFullFilled();
    if (this.isInfoFullFilled) {
      if (this.afService.getAuth().auth.currentUser) {
        // user signed in
        // this.startLoading();
        this.shop.OWNER = this.afService.getAuth().auth.currentUser.uid;
        this.shop.DATE_CREATE = this.appService.getCurrentDataAndTime().toString();
        console.log(this.shop);
        // ADD NEW
        if (this.action === 'add-new') {
          console.log(this.shop);
          this.afService.addItem2List('Shops', this.shop)
            .then((res) => {
              console.log(res);
              console.log(res.key);
              let name = new Date().getTime().toString();
              this.dbService.uploadBase64Image2FBReturnPromiseWithURL('ShopImages/' + res.key, this.SHOP_IMAGE, name)
                .then((url) => {
                  this.afService.updateObjectData('Shops/' + res.key, { IMAGE: url })
                    .then(() => {
                      this.hideLoading();
                      this.resetShop();
                      this.go2Page('MapPage');
                    })
                    .catch((err) => {
                      console.log(err);
                      this.appService.alertError('Error', err.toString())
                      this.hasPosted = false;
                    })
                })
                .catch((err) => {
                      console.log(err);
                      this.appService.alertError('Error', err.toString())
                      this.hasPosted = false;
                    })
            }, (err) => { console.log(err) })
        } else {
          // UPDATE
        }
      } else {
        // user not signed in yet
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToPage();
      }
    }
  }

  alertMsgWithConfirmationToGoToPage() {
    this.alertCtrl.create({
      title: 'Not Signed',
      message: 'Plz login to continue',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('go to Account page to login ');
            // this.navCtrl.popToRoot();
            this.navCtrl.push('AccountPage', { action: 'sign-in' });
          }
        }
      ]
    }).present();
  }

  checkInfoFullFilled() {
    this.isInfoFullFilled = true;
    if (this.shop.NAME == null || this.shop.NAME == '') {
      this.isInfoFullFilled = false;
      console.log(this.shop.NAME, ' is missed');
    }
    if (this.shop.ADDRESS == null || this.shop.ADDRESS == '') {
      this.isInfoFullFilled = false;
      console.log(this.shop.ADDRESS, ' is missed');
    }

    if (this.SHOP_IMAGE == null){
      this.isInfoFullFilled = false;
      console.log(this.shop.NAME, 'image is missed');
    }

    console.log(this.shop.NAME);
    console.log(this.shop.ADDRESS);
    console.log(this.isInfoFullFilled, '<--isInfoFullfilled?');
  }

  // LOADING
  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 20000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  private hideLoadingWithMessage(message: string) {
    this.loading.dismiss();
    this.appService.alertMsg('Alert', message);
    this.go2Page('MapPage')
  }

  go2Page(page: string) {
    const root = this.app.getRootNav();
    root.setRoot(page);
  }

  resetShop(){
    this.localService.SHOP = this.localService.SHOP_DEFAULT;
  }

}
