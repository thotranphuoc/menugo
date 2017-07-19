import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, AlertController } from 'ionic-angular';

import { LocalService } from '../../services/local.service';
import { ImageService } from '../../services/image.service';
import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';

import { iItem } from '../../interfaces/item.interface';

@IonicPage()
@Component({
  selector: 'page-menu-item-add',
  templateUrl: 'menu-item-add.html',
})
export class MenuItemAddPage {
  loading: any;
  item: iItem = null;
  SHOP_ID: string = null;
  SHOP_IMAGES: string[] = [];
  base64Image: string = null;
  base64Images: any[] = [];
  action: string = 'add-new';
  hasPosted: boolean = false;
  isInfoFullFilled: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private app: App,
    private afService: AngularFireService,
    private dbService: DbService,
    private appService: AppService,
    private localService: LocalService,
    private imageService: ImageService) {
    this.SHOP_ID = this.navParams.get('SHOP_ID');
    this.item = this.localService.ITEM_DEFAULT;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait....',
      spinner: 'crescent'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuItemAddPage');
  }

  takePhoto() {
    this.selectPhotoByBrowser();
  }

  selectPhotoByBrowser() {
    console.log('select photo')
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        // this.localService.ITEM_IMG64s = imgDataUrls;
        // this.base64Images = imgDataUrls;
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = imgDataUrls
          // imgDataUrls.forEach(img => {
          //   let image = { img: img }
          //   console.log(image);
          //   this.base64Images.push(image)
          // });
        }, 2000)
        // setTimeout(() => {
        //   console.log(imgDataUrls);
        //   this.base64Images = imgDataUrls;
        //   this.localService.ITEM_IMG64s = imgDataUrls;
        //   // this.hasNewAvatar = true;
        //   // console.log(this.hasNewAvatar);
        // }, 3000);
      })
  }

  createItem() {
    this.checkInfoFullFilled();
    console.log(this.base64Images);
    if (this.isInfoFullFilled) {
      console.log(this.base64Images);
      if (this.afService.getAuth().auth.currentUser) {
        // user signed in
        // this.startLoading();
        this.item.ITEM_DATE_CREATE = this.appService.getCurrentDataAndTime().toString();
        this.item.ITEM_SHOP_ID = this.SHOP_ID;
        console.log(this.item);
        console.log(this.base64Images);
        // ADD NEW
        if (this.action === 'add-new') {
          console.log(this.item);
          console.log(this.base64Images);
          this.afService.addItem2List('Items', this.item)
            .then((res) => {
              console.log(res);
              let ITEM_ID = res.key;
              console.log(ITEM_ID);
              // update shop's item /Shop_Items
              this.dbService.getListReturnPromise_ArrayOfData('Shop_Items/' + this.SHOP_ID)
                .then((ITEMS_KEY: string[]) => {
                  let items = ITEMS_KEY;
                  items.push(ITEM_ID);
                  this.afService.updateObjectData('Shop_Items/' + this.SHOP_ID, items);
                }, err => this.showErr(err))
              
              // update ITEM_ID
              this.afService.updateObjectData('Items/' + ITEM_ID + '/ITEM_ID', ITEM_ID);
              
              // upload Item image and update Item/IMAGES
              let name = new Date().getTime().toString();
              console.log(this.base64Images);
              this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ItemImages/' + ITEM_ID, this.base64Images, name)
                .then((urls) => {
                  console.log('upload item images --> done');
                  console.log(urls);
                  this.afService.updateObjectData('Items/' + ITEM_ID + '/ITEM_IMAGES', urls)
                    .then(() => {
                      console.log('update item image successs');
                      this.hideLoading();
                      this.resetItem();
                      // this.go2Page('MapPage');
                      this.navCtrl.pop();
                    }, err => this.showErr1(err))
                }, err=> this.showErr1(err))
            }, (err) => this.showErr(err))
        } else {
          // UPDATE
        }
      } else {
        // user not signed in yet
        this.hasPosted = false;
        this.alertMsgWithConfirmationToGoToAccountPage();
      }

    } else {
      // info not fullfilled
      this.hasPosted = false;
      this.appService.alertMsg('Notice', 'Please fill all information required');
    }
  }

  checkInfoFullFilled() {
    this.isInfoFullFilled = true;
    if (this.item.ITEM_NAME_LOCAL == null || this.item.ITEM_NAME_LOCAL == '') {
      this.isInfoFullFilled = false;
      console.log(this.item.ITEM_NAME_LOCAL, 'NAME_LOCAL is missed');
    }
    if (this.item.ITEM_NAME_EN == null || this.item.ITEM_NAME_EN== '') {
      this.isInfoFullFilled = false;
      console.log(this.item.ITEM_NAME_EN, 'NAME_EN is missed');
    }
    if (this.item.ITEM_PRICE == null) {
      this.isInfoFullFilled = false;
      console.log(this.item.ITEM_PRICE, 'PRICE is missed');
    }
    if (this.item.ITEM_SIZE == null || this.item.ITEM_SIZE == '') {
      this.isInfoFullFilled = false;
      console.log(this.item.ITEM_SIZE, 'size is missed');
    }

    // DONT KNOW WHY BELOW SET this.base64Images = null
    // if (this.base64Images == null) {
    //   this.isInfoFullFilled = false;
    //   console.log(this.base64Image, 'image is missed');
    // } else {
    //   if (this.base64Images.length = 0) {
    //     this.isInfoFullFilled = false;
    //     console.log(this.base64Image, 'image is missed');
    //   }
    // }
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

  // private hideLoadingWithMessage(message: string) {
  //   this.loading.dismiss();
  //   this.appService.alertMsg('Alert', message);
  //   // this.go2Page('MapPage')
  //   this.navCtrl.pop();
  // }

  go2Page(page: string) {
    const root = this.app.getRootNav();
    root.setRoot(page);
  }

  alertMsgWithConfirmationToGoToAccountPage() {
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

  resetItem() {
    this.localService.ITEM = this.localService.ITEM_DEFAULT;
    this.localService.ITEM_IMG64s = this.localService.ITEM_IMG64s_DEFAULT;
  }

  ionViewWillEnter() {
    this.base64Images = this.localService.ITEM_IMG64s;
    this.item = this.localService.ITEM;
  }

  // ionViewWillLeave() {
  //   this.localService.ITEM = this.item;
  //   this.localService.ITEM_IMG64s = this.base64Images;
  // }

  // test() {
  //   // console.log(this.base64Images)
  //   let res: any;
  //   // res = this.afService.getObject('Items/-Kp5VaG76oBUeHsGftNC/IMAGES');
  //   this.dbService.getListReturnPromise_ArrayOfData('Items/-Kp5VaG76oBUeHsGftNC/IMAGES')
  //     .then((res) => {
  //       console.log(res);
  //     })

  //   this.dbService.getListReturnPromise_ArrayOfKey('Items/-Kp5VaG76oBUeHsGftNC/IMAGES')
  //     .then((res) => {
  //       console.log(res);
  //     })

  //   this.dbService.getListReturnPromise_ArrayOfObjectWithKey_Data('Items/-Kp5VaG76oBUeHsGftNC/IMAGES')
  //     .then((res) => {
  //       console.log(res);
  //     })

  // }

  // ERROR HANDLING
  showErr(err){
    console.log(err);
    this.appService.alertError('Error', err);
  }

  showErr1(err){
    console.log(err);
    this.appService.alertError('Error', err);
    this.hasPosted = false;
  }


}
