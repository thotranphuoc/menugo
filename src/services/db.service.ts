import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

// for af auth
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { iShop } from '../interfaces/shop.interface';

@Injectable()
export class DbService {



    constructor(
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth) {
    }

    insertOneNewItemReturnPromise(item, dbName) {
        let db = firebase.database().ref(dbName);
        return db.push(item);
    }

    //VERIFIED: upload array of images, return array of url
    uploadBase64Images2FBReturnPromiseWithArrayOfURL(path: string, imageDatas: string[], dbFileName: string) {
        let promises = [];
        imageDatas.forEach((imageData, index) => {
            promises[index] = new Promise((resolve, reject) => {
                let name = dbFileName + '_' + index.toString();
                this.uploadBase64Image2FBReturnPromiseWithURL(path, imageData, name)
                    .then(url => {
                        resolve(url)
                    })
            })
        });
        return Promise.all(promises);
    }

    //VERIFIED: upload one image, return url
    uploadBase64Image2FBReturnPromiseWithURL(path: string, imageData: string, name: string) {
        return new Promise((resolve, reject) => {
            let storageRef = firebase.storage().ref(path + '/' + name);
            storageRef.putString(imageData, 'data_url', { contentType: 'image/png' })
                .then((res) => {
                    console.log(res);
                    resolve(res.downloadURL);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    // VERIFIED
    getListReturnPromise_ArrayOfData(dbURL) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dbURL);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let item = _childSnap.val();
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    // VERIFIED
    getListReturnPromise_ArrayOfKey(dBName) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dBName);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let item = _childSnap.key;
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    // VERIFIED
    getListReturnPromise_ArrayOfObjectWithKey_Data(dBName) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dBName);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let key = _childSnap.key;
                    let data = _childSnap.val();
                    let item = {
                        key: key,
                        data: data
                    }
                    // console.log(key, data)
                    // console.log(item)
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    getOneItemReturnPromise(dbURL) {
        return new Promise((resolve, reject) => {
            let db = firebase.database().ref(dbURL);
            db.once('value')
                .then((data) => {
                    // console.log(data.val());
                    resolve(data.val())
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                })
        })
    }


}

