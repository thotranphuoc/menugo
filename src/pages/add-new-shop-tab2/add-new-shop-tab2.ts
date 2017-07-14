import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ImageService } from '../../services/image.service';
import { LocalService } from '../../services/local.service';

import { iShop } from '../../interfaces/shop.interface';

@IonicPage()
@Component({
  selector: 'page-add-new-shop-tab2',
  templateUrl: 'add-new-shop-tab2.html',
})
export class AddNewShopTab2Page {
  shop: iShop;
  base64Image: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private imageService: ImageService,
    private localService: LocalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewShopTab2Page');
  }

  ionViewWillLeave(){
    this.localService.SHOP_IMAGE = this.base64Image;
  }

  takePhoto(){
    this.selectPhotoByBrowser();
  }

  selectPhotoByBrowser() {
    console.log('select photo')
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrl: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrl);
          this.base64Image = imgDataUrl[0];
          // this.hasNewAvatar = true;
          // console.log(this.hasNewAvatar);
        }, 1000);
      })
  }

}
