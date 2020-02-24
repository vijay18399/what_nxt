import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  contacts = [];
  backup = [];
  mynumber = '';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.contacts = this.router.getCurrentNavigation().extras.state.contacts;
        this.backup = this.contacts;
        this.mynumber = this.router.getCurrentNavigation().extras.state.phoneNumber;
      }
    });
   }

  ngOnInit() {
    
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

   onSearchTerm(ev: CustomEvent) {
    
    const val = ev.detail.value;
    console.log(val);
    if (val && val.trim() !== '') {
      this.contacts = this.contacts.filter(term => {
        return term._objectInstance.displayName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
           this.contacts = this.backup;    }
  }

}
