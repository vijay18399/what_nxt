import { Component, OnInit } from '@angular/core';
import { ApiService, } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  constructor(private api: ApiService, private alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private socket: Socket, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state.isgroupCreated) {
          this.loadData(true);
          alert('new group created please refresh if not updated');
        }
        if (this.router.getCurrentNavigation().extras.state.group) {
          let l = this.router.getCurrentNavigation().extras.state.group;
          const x = this.groups.filter((attr) => {
            return attr._id != l._id;
          });
          x.push(l)
          this.groups = x;
          this.loadData(true);
        }
      }
    });
  }
  groups = [];
  user = null;
  users = [];
  ngOnInit() {
    this.loadData(true);
    this.socket.fromEvent('group_created').subscribe(data => {
      this.showToast(data['groupname'] + ' created successfully !! please reload ');
    });
  }
  ionViewWillEnter() {
    this.user = this.api.getUser();
    console.log(this.user);
    this.loadData(true);
  }


  loadData(refresh = false, refresher?) {
    this.api.getGroups(refresh).subscribe(res => {
      const x = res.filter((attr) => {
        return attr.membercheck.includes(this.user.phoneNumber);
      });
      console.log(x);
      this.groups = x;
      if (refresher) {
        refresher.target.complete();
      }
    });
    this.api.getUsers(refresh).subscribe(res => {
      this.users = res;
      console.log(res);
      if (refresher) {
        refresher.target.complete();
      }
    });
  }
  signOut() {
    this.api.logout();
  }
  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  async add() {
    const alert = await this.alertController.create({
      header: 'Create Group!',
      inputs: [
        {
          name: 'groupname',
          type: 'text',
          placeholder: 'Group name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.groupname) {
              const admin = this.user;
              const users = this.users;
              const navigationExtras = {
                state: {
                  data, admin, users
                }
              };
              this.router.navigate(['selector'], navigationExtras);
            } else {
                   this.showToast('Group Cannot be created without name');
            }

          }
        }
      ]
    });

    await alert.present();
  }

  open(group) {
    const user = this.user;
    const navigationExtras = {
      state: {
        group, user
      }
    };
    this.router.navigate(['gchat'], navigationExtras);
  }

}
