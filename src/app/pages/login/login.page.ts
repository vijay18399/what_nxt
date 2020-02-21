import { Component, OnInit } from '@angular/core';
import { Sim } from '@ionic-native/sim/ngx';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public simInfo: any;
  public cards: any;
  // today = new Date().toJSON().slice(0,10).replace(/-/g, '-');
   user = {
    Name : '',
    phoneNumber : '',
    Gender : 'M',
    BirthDate : new Date().toJSON().slice(0, 10).replace(/-/g, '-')
  };
  users = [];
  constructor(private sim: Sim , private router: Router , private api: ApiService , private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}
  ngOnInit() {
this.getSimData();
this.loadData(true);
  }
  loadData(refresh = false, refresher?) {
    this.api.getUsers(refresh).subscribe(res => {
        this.users = res;
        if (refresher) {
          refresher.target.complete();
        }
      });
    }
  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.cards = simData.cards;
        console.log(simData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async login() {
    this.user.phoneNumber = this.user.phoneNumber.substr(this.user.phoneNumber.length - 10);
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.login(this.user).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
      if (res) {
      const decoded = helper.decodeToken(res);
      const r = 'contacts/' + decoded['phoneNumber'];
      const users = this.users;
      const navigationExtras = {
        state: {
          users
        }
      };
       this.router.navigate([r], navigationExtras);
      }
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Login failed',
        message: err.error.msg,
        buttons: ['OK']
      });
      await alert.present();
    });
  }

}
