import { Injectable } from '@angular/core';
// import { AlertController, ToastController } from 'ionic-angular';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireService } from './af.service';
import { DbService } from './db.service';

// import { iProfile } from '../interfaces/profile.interface';
import { iShop } from '../interfaces/shop.interface';
import { iSetting } from '../interfaces/setting.interface';
import { iItem } from '../interfaces/item.interface';

@Injectable()

export class LocalService {

    SHOP_DEFAULT: iShop = {
        SHOP_ID: null,
        SHOP_OWNER: null,
        SHOP_DATE_CREATE: null,
        SHOP_LOCATION: null,
        SHOP_NAME: null,
        SHOP_KIND: null,
        SHOP_ADDRESS: null,
        SHOP_IMAGES: null,
        SHOP_PHONE: null,
        SHOP_isCREDIT: false,
        SHOP_isMOTO_PARK_FREE: false,
        SHOP_isCAR_PARK_FREE: false,
        SHOP_isMEMBERSHIP: false,
        SHOP_isVISIBLE: true
    }

    SHOP: iShop = {
        SHOP_ID: null,
        SHOP_OWNER: null,
        SHOP_DATE_CREATE: null,
        SHOP_LOCATION: null,
        SHOP_NAME: null,
        SHOP_KIND: null,
        SHOP_ADDRESS: null,
        SHOP_IMAGES: null,
        SHOP_PHONE: null,
        SHOP_isCREDIT: false,
        SHOP_isMOTO_PARK_FREE: false,
        SHOP_isCAR_PARK_FREE: false,
        SHOP_isMEMBERSHIP: false,
        SHOP_isVISIBLE: true
    }

    ITEM_DEFAULT: iItem = {
        ITEM_ID: null,
        ITEM_NAME_LOCAL: null,
        ITEM_NAME_EN: null,
        ITEM_IMAGES: [], 
        ITEM_PRICE: null,
        ITEM_SIZE: null,
        ITEM_DATE_CREATE: null,
        ITEM_SHOP_ID: null,
        ITEM_ON_SALE: false,
        ITEM_NEW: true,
        ITEM_VISIBLE: true
    }

    ITEM: iItem = {
        ITEM_ID: null,
        ITEM_NAME_LOCAL: null,
        ITEM_NAME_EN: null,
        ITEM_IMAGES: [], 
        ITEM_PRICE: null,
        ITEM_SIZE: null,
        ITEM_DATE_CREATE: null,
        ITEM_SHOP_ID: null,
        ITEM_ON_SALE: false,
        ITEM_NEW: true,
        ITEM_VISIBLE: true
    }

    ITEM_IMG64s_DEFAULT: string[] = null;
    ITEM_IMG64s: string[] = null;

    DEFAULT

    SETTING_DEFAULT: iSetting = {
        setCafe: true,
        setRestaurant: true,
        setTakeAway: true,
        setHomeMade: true,
        setOther: true,
        language: 'english'
    }

    SETTING: iSetting = {
        setCafe: true,
        setRestaurant: true,
        setTakeAway: true,
        setHomeMade: true,
        setOther: true,
        language: 'english'
    }

    SHOP_IMAGE: string;
    SHOP_IMAGES: string[];

    //ShopMenuPage, ShopOrderPage
    ITEM_INDEX_DEFAULT: any = null;
    ITEM_INDEX: any = null;

    ITEMS_DEFAULT: iItem[] = null;
    ITEMS: iItem[] = null;


    itemAction: string = 'add-new';  // add-new, item-update
    existingImageUrls: string[] = [];
    orgExistingImageUrls: string[] = [];
    resizedImages: string[] = [];
    images: any[] = [];
    isUserChosenPositionSet: boolean = false;
    existingSoldItemID: string = null;

    NO_AVATAR: string = 'https://firebasestorage.googleapis.com/v0/b/auth-38cb7.appspot.com/o/App_images%2Favatar.png?alt=media&token=27b34944-943d-49f8-a204-419980813db4';
    USER_AVATAR: string = null;
    isProfileLoaded: boolean = false;

    constructor(
        private afService: AngularFireService,
        private dbService: DbService
    ) { }

    getShop() {
        return this.SHOP;
    }

    getImages() {
        return this.images;
    }
    setImages(images) {
        this.images = images;
    }

    getExistingSoldItemID() {
        return this.existingSoldItemID;
    }
    setExistingSoldItemID(id: string) {
        this.existingSoldItemID = id;
    }


    setItemAction(action: string) {
        this.itemAction = action
    }
    getItemAction() {
        return this.itemAction;
    }
    // For Add-item-new/ CAMERA
    setExistingImageUrls(imageUrls: string[]) {
        this.existingImageUrls = imageUrls;
    }
    getExistingImageUrls() {
        return this.existingImageUrls
    }

    setOrgExistingImageUrls(imageUrls: string[]) {
        this.orgExistingImageUrls = imageUrls;
        console.log(this.orgExistingImageUrls);
    }
    getOrgExistingImageUrls() {
        return this.orgExistingImageUrls
    }

    setResizedImages(resizedImages) {
        this.resizedImages = resizedImages;
    }
    getResizedImages() {
        return this.resizedImages;
    }

    // For Add-item-new // LOCATION
    setIsUserChosenPositionSet(isSet: boolean) {
        this.isUserChosenPositionSet = isSet
    }
    getIsUserChosenPositionSet() {
        return this.isUserChosenPositionSet;
    }

    getUserAvatar() {
        return this.USER_AVATAR;
    }

    setUserAvatar(avatar) {
        this.USER_AVATAR = avatar;
    }

    // initUserInfo() {
    //     return new Promise((resolve, reject) => {
    //         let profile: iProfile = null;
    //         if (this.afService.getAuth().auth.currentUser != null) {
    //             // getProfile
    //             let uid = this.afService.getAuth().auth.currentUser.uid;
    //             this.dbService.getOneItemReturnPromise('UsersProfile/' + uid)
    //                 .then((res) => {
    //                     // console.log(res.val());
    //                     profile = res.val();
    //                     // console.log(profile);
    //                     resolve(profile);
    //                 })
    //         } else {
    //             console.log('user not login');
    //             reject(null);
    //         }
    //     })
    // }
}

export interface iPhoto {
    url: string,
    VISIBLE: boolean,
    NEW: boolean
}

/*
this service is used to hold local variables between pages
 */