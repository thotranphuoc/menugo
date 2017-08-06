import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireService } from '../services/af.service';
import { DbService } from '../services/db.service';
import { LocalService } from '../services/local.service';
import { iProfile } from '../interfaces/profile.interface';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'MapPage';
  pages: Array<{title: string, component: string, icon: string}>;
  pages2: Array<{title: string, component: string, icon: string}>;
  isAdminOfApp: boolean = false;
  PROFILE: iProfile;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private dbService: DbService,
    private localService: LocalService,
    private afService: AngularFireService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'MapPage', icon:'home' },
      { title: 'List', component: 'ListPage', icon:'list-box' },
      { title: 'Setting', component: 'SettingPage', icon:'cog' },
      { title: 'About', component: 'AboutPage', icon:'information-circle' },
      // { title: 'AngularFire2', component: 'Angularfire2Page' },
    ];

    this.pages2 = [
      { title: 'Admin', component: 'AdminPage', icon:'paw' },
    ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  ionOpen() {
    console.log('Menu is opened')
    // this.PROFILE = null;
    // if (!this.localService.isProfileLoaded) {
    //   this.localService.initUserInfo()
    //     .then((profile: iProfile) => {
    //       console.log(profile)
    //       this.profile = profile;
    //       this.userAvatar = this.profile.AVATAR_URL;
    //       this.userName = this.profile.NAME;
    //       this.localService.isProfileLoaded = true;
    //     })
    //     .catch((err)=>{
    //       console.log(err);
    //       this.userAvatar = null;
    //       this.userName = null;
    //       this.profile = null;
    //     })
    // }
    let USER = this.afService.getAuth().auth.currentUser;
        if(USER){
          let USER_ID = USER.uid;
          this.dbService.getOneItemReturnPromise('UserProfiles/'+USER_ID).then((profile: iProfile)=>{
            this.PROFILE = profile;
            this.localService.PROFILE = profile;
            console.log(this.PROFILE);
          })
          this.dbService.checkIfUserIsAdmin(USER_ID).then((res:boolean)=>{
            this.isAdminOfApp = res;
          })
        }else{
          this.PROFILE = null;
        }
  }
}
