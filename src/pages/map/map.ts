import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GmapService } from '../../services/gmap.service';
// import { DbService } from '../../services/db.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { iPosition } from '../../interfaces/position.interface';
import { iShop } from '../../interfaces/shop.interface';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  mapEl: any;
  map: any;
  loading: any;
  shops: iShop[] = [];
  shopsO: FirebaseListObservable<iShop[]>;;
  insideMapShops: iShop[] =[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private gmapService: GmapService,
    private afDB: AngularFireDatabase
  ) {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter ...');
    this.shopsO = this.afDB.list('Shops');
    this.shopsO.subscribe((shops)=>{
      console.log(shops);
      this.shops = shops;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.startLoading();
    setTimeout(() => {
      this.mapEl = document.getElementById('map');
      this.initMap(this.mapEl)
    }, 1000)
  }

  initMap(mapElement) {
    // this.gmapService.getCurrentPosition()
    this.geolocation.getCurrentPosition()
      .then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let pos: iPosition = { lat: position.coords.latitude, lng: position.coords.longitude }
        // this.gmapService.setUserCurrentPosition(pos);
        this.showMap(pos, mapElement)
      })
      .catch((err) => {
        this.gmapService.getUserCurrentPosition()
          .then((position: iPosition) => {
            console.log(position);
            this.showMap(position, mapElement)
          }, err => {
            console.log(err);
            alert('No gps signal. Your location cannot be detected now.');
            let pos: iPosition = { lat: 10.778168043677463, lng: 106.69638633728027};
            this.showMap(pos,mapElement);
          })
      })

  }

  

  showMap(position: iPosition, mapElement) {
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      fullscreenControl: false
    }

    console.log(mapElement, mapOptions);
    this.gmapService.initMap(mapElement, mapOptions)
      .then((map) => {
        console.log(map);
        this.map = map;
        // when maps is loaded and become idle
        google.maps.event.addListener(this.map, 'idle', () => {
          console.log('map was loaded fully');
          this.hideLoading();
          this.loadShops();
          let bound = this.map.getBounds();
          console.log(bound);

        })
      })
  }

  loadShops(){
    // remove existing marker first. then load new markers later to sure that new INVISIBLE markers will be removed
    this.gmapService.removeMarkersFromMap(this.gmapService.getMarkers());
    this.insideMapShops = [];
    this.shops.forEach(shop=>{
      if(this.gmapService.isPositionInsideMap(shop.SHOP_LOCATION,this.map)){
        this.gmapService.addMarkerToMapWithIDReturnPromiseWithMarker(this.map,shop.SHOP_LOCATION, shop);
        this.insideMapShops.push(shop);
      }
    })
  }

  private startLoading() {
    this.loading.present();
    setTimeout(() => {
      this.hideLoading();
      // alert('Please turn on internet and location permission. Then open app again')
    }, 15000)
  }

  private hideLoading() {
    this.loading.dismiss();
  }

  go2List() {
    console.log('go2ListPage');
    this.navCtrl.push('ListPage', {shops: this.insideMapShops});
  }

  go2AddNewShop(){
    this.navCtrl.push('AddNewShopPage');
  }

}
