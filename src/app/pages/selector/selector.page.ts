import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Platform, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.page.html',
  styleUrls: ['./selector.page.scss'],
})
export class SelectorPage implements OnInit {

  regex = /^[+0-9 ]+$/;
  users = [];
  admin = null;
  mynumber = '';
  xmembercheck = '';
  allContacts = [];
  backup = [];
  members = [];
  membercheck = [];
  r = [
    {
      '_objectInstance': {

        'displayName': 'Vijay',
        'phoneNumbers': [
          {
            'id': '5',
            'pref': false,
            'value': '6301832161',
            'type': 'mobile'
          }
        ],


      },
      'rawId': '1'
    },
    {
      '_objectInstance': {

        'displayName': 'daddy',
        'phoneNumbers': [
          {
            'id': '5',
            'pref': false,
            'value': '9912939959',
            'type': 'mobile'
          }
        ],


      },
      'rawId': '4'
    },
    {
      '_objectInstance': {
        'displayName': 'srujana',
        'phoneNumbers': [
          {
            'id': '10',
            'pref': false,
            'value': '9963219564',
            'type': 'mobile'
          }
        ],
      },
      'rawId': '2'
    }
  ];
  x = '';
  groupname = '';
  // tslint:disable-next-line: max-line-length
  constructor( private socket: Socket, private activatedRoute: ActivatedRoute, private alertController: AlertController, private router: Router, private contacts: Contacts, private apiService: ApiService, private plt: Platform, public loadingController: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.groupname = this.router.getCurrentNavigation().extras.state.data.groupname;
        this.admin = this.router.getCurrentNavigation().extras.state.admin;
        this.users = this.router.getCurrentNavigation().extras.state.users;
        console.log(this.users);
      }
    });
  }

  ngOnInit() {
    this.loadData(true);
    this.getAllContacts();
    this.plt.ready().then(() => {
      // this.mynumber = this.activatedRoute.snapshot.paramMap.get('phoneNumber');
      this.getAllContacts();
    });
    if (this.allContacts.length === 0) {
      this.allContacts = this.r;
      this.backup = this.allContacts;
    }
  }
  logout() {
    this.apiService.logout();
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
  getAllContacts() {
    this.contacts.find(['displayName', 'phoneNumbers'], { filter: '', multiple: true })
      .then(data => {
        // tslint:disable-next-line: max-line-length
        this.allContacts = data.filter(x => x.phoneNumbers != null && x.displayName != null && x['_objectInstance'].phoneNumbers[0].value.length >= 10 && this.regex.test(x['_objectInstance'].phoneNumbers[0].value) && this.users.includes(this.Contactparser(x['_objectInstance'].phoneNumbers[0].value)));
        this.backup = this.allContacts;
      });
  }

  Contactparser(str) {
    str = str.split(' ').join('');
    str = str.slice(str.length - 10);
    return str;
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
  add(contact) {
    if (this.membercheck.includes(this.Contactparser(contact._objectInstance.phoneNumbers[0].value))) {
      console.log(contact);
      this.membercheck = this.membercheck.filter((value) => {
        return value !== this.Contactparser(contact._objectInstance.phoneNumbers[0].value);
      });

      this.members = this.members.filter((attr) => {
        return attr.phoneNumber !== this.Contactparser(contact._objectInstance.phoneNumbers[0].value);
      });


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

  async adder() {
    const loading = await this.loadingController.create();
    loading.present(); 
    const member = {
      name: this.admin['Name'],
      phoneNumber: this.admin['phoneNumber']
    };
    this.members.push(member);
    this.membercheck.push(this.admin['phoneNumber']);
    let data = {
      groupname: this.groupname,
      members: this.members,
      membercheck: this.membercheck,
      admin: this.admin
    };

    this.apiService.CreateGroups(data).pipe()
      .subscribe(res => {
        if (res) {
          loading.dismiss();
          const r = 'tab/groups';
         const isgroupCreated = true;
          const navigationExtras = {
            state: {
              isgroupCreated
            }
          };
           this.router.navigate([r], navigationExtras);
        }
      }, async err => {
        const alert = await this.alertController.create({
          header: 'Group Creation failed',
          message: err.error.msg,
          buttons: ['OK']
        });
        await alert.present();
      });
  }



}
