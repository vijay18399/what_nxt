import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contacts } from '@ionic-native/contacts';
import { ApiService } from '../../services/api.service';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-uselector',
  templateUrl: './uselector.page.html',
  styleUrls: ['./uselector.page.scss'],
})
export class UselectorPage implements OnInit {
  group = null;
  allContacts = [];
  backup = [];
  regex = /^[+0-9 ]+$/;
  users = [];
  xmembercheck = [];
  membercheck = [];
  members = [];
 
  constructor(private loadingCtrl: LoadingController, private activatedRoute: ActivatedRoute, private alertController: AlertController, private apiService: ApiService, private router: Router, private plt: Platform, private contacts: Contacts) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.group = this.router.getCurrentNavigation().extras.state.group;
        this.xmembercheck = this.router.getCurrentNavigation().extras.state.group.membercheck;
      }
    });
  }

  ngOnInit() {
    
    this.plt.ready().then(() => {
      // this.mynumber = this.activatedRoute.snapshot.paramMap.get('phoneNumber');
      this.getAllContacts();
    });
  }
  ionViewWillEnter() {
    this.loadData(true);
  }
  getAllContacts() {
    this.contacts.find(['displayName', 'phoneNumbers'], { filter: '', multiple: true })
      .then(data => {
        // tslint:disable-next-line: max-line-length
        this.allContacts = data.filter(x => x.phoneNumbers != null && x.displayName != null && x['_objectInstance'].phoneNumbers[0].value.length >= 10 && this.regex.test(x['_objectInstance'].phoneNumbers[0].value) && this.users.includes(this.Contactparser(x['_objectInstance'].phoneNumbers[0].value)) && !this.xmembercheck.includes(this.Contactparser(x['_objectInstance'].phoneNumbers[0].value)));
        this.backup = this.allContacts;
      });
  }
  Contactparser(str) {
    str = str.split(' ').join('');
    str = str.slice(str.length - 10);
    return str;
  }
  loadData(refresh = false, refresher?) {
    this.apiService.getUsers(refresh).subscribe(res => {
      this.users = res;
      this.getAllContacts();
      if (refresher) {
        refresher.target.complete();
      }
    });

  }
  add(contact) {
 
    if (this.membercheck.includes(this.Contactparser(contact._objectInstance.phoneNumbers[0].value))) {
      
      this.membercheck = this.membercheck.filter(value =>
         value !== this.Contactparser(contact._objectInstance.phoneNumbers[0].value)
      );

      this.members = this.members.filter(attr => 
         attr.phoneNumber !== this.Contactparser(contact._objectInstance.phoneNumbers[0].value) );
    } else {
      this.membercheck.push(this.Contactparser(contact._objectInstance.phoneNumbers[0].value));
      const data = {
        name: contact._objectInstance.displayName,
        phoneNumber: this.Contactparser(contact._objectInstance.phoneNumbers[0].value)
      };
      this.members.push(data);
    }

    console.log(this.membercheck);
    console.log(this.members);
  }
  onSearchTerm(ev: CustomEvent) {

    const val = ev.detail.value;
    console.log(val);
    if (val && val.trim() !== '') {
      this.allContacts = this.backup.filter(term => {
        return term._objectInstance.displayName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.allContacts = this.backup;
    }
  }
  async adder() {
    const loading = await this.loadingCtrl.create();
    loading.present(); 
    for (var x of this.membercheck) {
      this.group.membercheck.push(x);
    }
    for (var y of this.members) {
      this.group.members.push(y);
    }
    this.apiService.UpdateGroup(this.group).pipe()
      .subscribe(res => {
        if (res) {
          loading.dismiss();
         const group =this.group;
         const user = this.users; 
          const navigationExtras = {
            state: {
              group, user
            }
          };
          this.router.navigate(['ginfo'], navigationExtras);
        }
      }, async err => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'adding group memebers failed ',
          message: err.error.msg,
          buttons: ['OK']
        });
        await alert.present();
      });
  }

}
