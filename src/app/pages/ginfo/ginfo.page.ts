import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contacts } from '@ionic-native/contacts';
import { ApiService, } from '../../services/api.service';
@Component({
  selector: 'app-ginfo',
  templateUrl: './ginfo.page.html',
  styleUrls: ['./ginfo.page.scss'],
})
export class GinfoPage implements OnInit {
  group = null;
  admin = null;
  AdminNumber = null;
  members = [];
  count = 0;
  groupname = '';
  allContacts = [];
  regex = /^[+0-9 ]+$/;
  membercheck = [];
  GroupContacts = [];
  x = [];
  user = '';
  xcount = 0;
  constructor(private router: Router, private api: ApiService, private route: ActivatedRoute, private contacts: Contacts) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.group = this.router.getCurrentNavigation().extras.state.group;
        this.admin = this.router.getCurrentNavigation().extras.state.group.admin;
        this.groupname = this.group.groupname;
        this.count = this.group.members.length;
        this.members = this.group.members;
        this.membercheck = this.group.membercheck;
        this.getAllContacts();
        this.ContactFilter();
      }
    });
  }

  ngOnInit() {
    this.getAllContacts();
    this.ContactFilter();
  }
  getAllContacts() {
    this.contacts.find(['displayName', 'phoneNumbers'], { filter: '', multiple: true })
      .then(data => {
        // tslint:disable-next-line: max-line-length
        this.GroupContacts = data.filter(x => x.phoneNumbers != null && x.displayName != null && x['_objectInstance'].phoneNumbers[0].value.length >= 10 && this.regex.test(x['_objectInstance'].phoneNumbers[0].value) && this.membercheck.includes(this.Contactparser(x['_objectInstance'].phoneNumbers[0].value)));
        this.allContacts = data.filter(x => x.phoneNumbers != null && x.displayName != null && x['_objectInstance'].phoneNumbers[0].value.length >= 10 && this.regex.test(x['_objectInstance'].phoneNumbers[0].value));
      });

  }
  Contactparser(str) {
    str = str.split(' ').join('');
    str = str.slice(str.length - 10);
    return str;
  }
  ContactFilter() {
    this.x = this.membercheck.filter((term) => {
      this.IsitNotAvaliable(term);
    });
  }
  IsitNotAvaliable(y) {
    const x = this.GroupContacts.filter((term) => {
      y === this.Contactparser(term['_objectInstance'].phoneNumbers[0].value);
    });
    if (x.length >= 1) {
      return false;
    } else {
      return true;
    }
  }
  getSentiment(message) {

    if (message.isTagged) {
      if (message.TagName === 'Important') {
        return 'primary';
      } else if (message.TagName === 'Personal') {
        return 'tertiary';
      } else if (message.TagName === 'Confidential') {
        return 'dark';
      }
    } else {
      if (message.score > 0.5) {
        return 'success';
      } else if (message.score < 0.0) {
        return 'danger';
      } else {
        return 'default';
      }

    }
  }
  Remove(pno) {
    let members = this.members.filter(term =>  term.phoneNumber !== pno );
    let membercheck = this.membercheck.filter(x =>  x !== pno );
    const data = {
      _id : this.group._id,
      groupname: this.groupname,
      members: members,
      membercheck: membercheck,
      admin: this.admin
    };
    this.api.UpdateGroup(data).subscribe(res => {
      if (res['success']) {
        this.GroupContacts = this.GroupContacts.filter(term =>  this.Contactparser(term._objectInstance.phoneNumbers[0].value) !== pno );
        this.members = members;
        this.membercheck = membercheck;
        this.group.members = members;
        this.group.membercheck = membercheck;
        this.count = this.membercheck.length;
      } else {
        alert('Failed');
      }
    });
  }
  add() {
 const group = this.group;
 const navigationExtras = {
  state: {
   group
  }
};
 this.router.navigate(['uselector'], navigationExtras);
  }
  back() {
    const user = this.user;
    const group = this.group;
    const navigationExtras = {
      state: {
        group, user
      }
    };
    this.router.navigate(['gchat'], navigationExtras);
  }
}
