import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { DbService } from './db.service';
import { LocalService } from './local.service';
import { GchartService } from './gchart.service';
import { AuthService } from './auth.service';
import { AngularFireService } from './af.service';

import { iOrder } from '../interfaces/order.interface';
import { iItem } from '../interfaces/item.interface';
import { iProfile } from '../interfaces/profile.interface';
import { iAccount } from '../interfaces/account.interface';

@Injectable()

export class CrudService {

    constructor(
        private appService: AppService,
        private dbService: DbService,
        private localService: LocalService,
        private gchartService: GchartService,
        private authService: AuthService,
        private afService: AngularFireService
    ) { }

    // CRUD account to use app
    // 1. Create account
    accountSignUp(EMAIL: string, PASSWORD: string) {
        return new Promise((resolve, reject) => {
            this.authService.signUp(EMAIL, PASSWORD).then((res) => {
                // update to DB Accounts
                let USER_ID = res.uid;
                let PROFILE: iProfile = {
                    PROFILE_AVATAR_URL: '',
                    PROFILE_NAME: 'No Name',
                    PROFILE_EMAIL: EMAIL,
                    PROFILE_BIRTHDAY: '',
                    PROFILE_TEL: '',
                    PROFILE_ADDRESS: '',
                    PROFILE_STATE: '',
                    PROFILE_VERIFIED: false,
                    PROFILE_UID: USER_ID,
                    PROFILE_PROVIDER: 'Email',
                    PROFILE_IDENTIFIER: '',
                    PROFILE_CREATED: Date.now().toString(),
                    PROFILE_OTHERS: null
                }
                console.log(res, PROFILE);
                this.dbService.insertAnObjectAtNode('UserProfiles/' + USER_ID, PROFILE).then(() => {
                    resolve({ PROFILE: PROFILE, message: 'Success' });
                })
                .catch((err)=>{
                    reject(err);
                })
            })
        })
    }
    // 2. Read Account

    // 3. Update Account

    // 4. delete Account


    // create manager/staff account
    createAdminWithNewAccount(EMAIL: string, PASS: string, NAME: string, SHOP_ID: string, role: string) {
        // 1. create new account
        return this.authService.signUp(EMAIL, PASS)
            .then((res) => {
                let USER_ID = res.uid;
                let data = {
                    UID: USER_ID,
                    ROLE: role
                };

                let promises = [];
                // 2. insert into AdminsOfShop
                let promise1 = this.dbService.insertElementIntoArray('AdminsOfShop/' + SHOP_ID, data)
                    .then((res) => {
                        console.log('add success')

                    }).catch((err) => {
                        console.log('Fail:', err)
                    })
                // 3. insert into Admins/UID/[Shop_list]
                let promise2 = this.dbService.insertElementIntoArray('Admins/' + USER_ID, SHOP_ID)
                    .then(() => {
                        console.log('add success')
                    }).catch((err) => {
                        console.log('Fail:', err)
                    })
                // 4. update Profile
                let URL = 'UserProfiles/' + USER_ID;
                let data1: iProfile = {
                    PROFILE_AVATAR_URL: '',
                    PROFILE_NAME: NAME,
                    PROFILE_EMAIL: EMAIL,
                    PROFILE_BIRTHDAY: '',
                    PROFILE_TEL: '',
                    PROFILE_ADDRESS: '',
                    PROFILE_STATE: '',
                    PROFILE_VERIFIED: false,
                    PROFILE_UID: '',
                    PROFILE_PROVIDER: '',
                    PROFILE_IDENTIFIER: '',
                    PROFILE_CREATED: Date.now().toString(),
                    PROFILE_OTHERS: null
                }
                let promise3 = this.dbService.insertAnObjectAtNode(URL, data1)
                promises.push(promise1);
                promises.push(promise2);
                promises.push(promise3);

                return Promise.all(promises);

            })
    }

    createAdminWithExistingAccount(EMAIL: string, ROLE: string, SHOP_ID: string) {
        console.log(EMAIL, ROLE, SHOP_ID);
        return new Promise((resolve, reject) => {
            this.afService.getListWithCondition('UserProfiles/', 'PROFILE_EMAIL', EMAIL, 1).subscribe((data: any) => {
                console.log(data);
                if (data.length > 0) {
                    // 1. get USER_ID from email
                    let USER_ID = data[0].$key;
                    console.log(USER_ID);
                    // 1.1 get current owner of uid if already manage this shop or not
                    this.dbService.getListReturnPromise_ArrayOfData('Admins/' + USER_ID).then((list: string[]) => {
                        console.log(list);
                        let index = list.indexOf(SHOP_ID);
                        if (index < 0) {
                            // not manage shop yet
                            let DATA = {
                                UID: USER_ID,
                                ROLE: ROLE
                            };
                            console.log(DATA);
                            // 2. insert into AdminsOfShop
                            this.dbService.insertElementIntoArray('AdminsOfShop/' + SHOP_ID, DATA)
                                .then((res) => {
                                    console.log('add AdminsOfShop success');
                                })
                                .then(() => {
                                    // 3. insert into Admins/UID/[Shop_list]
                                    return this.dbService.insertElementIntoArray('Admins/' + USER_ID, SHOP_ID)
                                })
                                .then(() => {
                                    console.log('add Admins success');
                                    resolve();
                                })
                                .catch((err) => {
                                    console.log('Fail:', err);
                                })
                        } else {
                            reject({ message: 'This user already manages this shop' })
                        }
                    })
                } else {
                    reject({ message: 'email is not registered yet, or profile not updated yet' })
                }
            })
        })
    }

    removeAdminOfUserFromShop(SHOP_ID, ADMIN, USER_ID) {
        return new Promise((resolve, reject) => {
            this.dbService.getListReturnPromise_ArrayOfData('AdminsOfShop/' + SHOP_ID).then((admins: any[]) => {
                console.log(admins);
                let index = admins.findIndex(x => x.UID === USER_ID);
                console.log(index);
                if (index < 0) {
                    // not exist
                    console.log('item not found');
                } else {
                    admins.splice(index, 1);
                    console.log(admins);
                    this.dbService.insertAnObjectAtNode('AdminsOfShop/' + SHOP_ID, admins)
                }
            })
                .then(() => {
                    this.dbService.getListReturnPromise_ArrayOfData('Admins/' + USER_ID).then((shop_list: any[]) => {
                        console.log(shop_list);
                        let index = shop_list.indexOf(SHOP_ID);
                        if (index < 0) {
                            // not exist
                            console.log('item not found');
                            resolve();
                        } else {
                            shop_list.splice(index, 1);
                            this.dbService.insertAnObjectAtNode('Admins/' + USER_ID, shop_list).then(() => {
                                console.log('Admins/' + USER_ID, 'updated');
                                resolve();
                            })

                        }
                    })
                })
                .catch((err) => {
                    reject(err);
                })


            // // remove from AdminsOfShop
            // this.dbService.removeElementFromArray('AdminsOfShop/' + SHOP_ID, ADMIN)
            //     .then((ress) => {
            //         console.log(ress);
            //         // remove from Admins/UID/[list]
            //         return this.dbService.removeElementFromArray('Admins/' + USER_ID, SHOP_ID);
            //     })
            //     .then((res) => {
            //         console.log(res);
            //         resolve();
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //         reject(err);
            //     })
        })


    }



}
