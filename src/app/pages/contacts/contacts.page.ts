import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Platform } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  regex = /^[+0-9 ]+$/ ;
  users = [];
  mynumber = '';
  allContacts = [];
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
  // tslint:disable-next-line: max-line-length
  constructor(private socket: Socket, private activatedRoute: ActivatedRoute, private router: Router, private contacts: Contacts, private apiService: ApiService, private plt: Platform, public loadingController: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.users = this.router.getCurrentNavigation().extras.state.users;
        this.mynumber = this.router.getCurrentNavigation().extras.state.phoneNumber;
        this.x = JSON.stringify(this.users);
        console.log(this.users);
      }
    });

   }

  ngOnInit() {
    this.socket.connect();
    this.plt.ready().then(() => {
     // this.mynumber = this.activatedRoute.snapshot.paramMap.get('phoneNumber');
      this.getAllContacts();
    });
    if (this.allContacts.length === 0) {
      this.allContacts = this.r;
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
    this.contacts.find(['displayName', 'phoneNumbers'], {filter: '', multiple: true})
    .then(data => {
      // tslint:disable-next-line: max-line-length
      this.allContacts = data.filter(x => x.phoneNumbers != null &&  x.displayName != null &&  x['_objectInstance'].phoneNumbers[0].value.length >= 10 && this.regex.test(x['_objectInstance'].phoneNumbers[0].value) && this.users.includes(this.Contactparser(x['_objectInstance'].phoneNumbers[0].value) )  );
  });
}

 Contactparser(str) {
  str = str.split(' ').join('');
  str = str.slice(str.length - 10);
  return str ;
}
open(contact) {
 const phoneNumber2 = this.Contactparser(contact._objectInstance.phoneNumbers[0].value);
 const phoneNumber = this.mynumber;
 const route = 'chat';
 const navigationExtras = {
  state: {
    contact,
    phoneNumber,
    phoneNumber2
  }
};
 this.router.navigate([route], navigationExtras);
}

search() {
  const phoneNumber =  this.mynumber;
  const route = 'search';
  const contacts = this.allContacts;
  const navigationExtras = {
     state : {
      contacts, phoneNumber
     }
 };
  this.router.navigate([route], navigationExtras);
}

}
