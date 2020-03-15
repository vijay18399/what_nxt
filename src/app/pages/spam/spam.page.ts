import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-spam',
  templateUrl: './spam.page.html',
  styleUrls: ['./spam.page.scss'],
})
export class SpamPage implements OnInit {
 urls = '';
  constructor(private activatedRoute: ActivatedRoute, private iab: InAppBrowser, private router: Router) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.urls = this.router.getCurrentNavigation().extras.state.result;
        console.log(this.urls);
      }
    });
  }

  ngOnInit() {
  }
  open(url) {
      console.log(url);
      const Regex = /^(http|https)/;
      if (Regex.test(url) === true) {
        const browser = this.iab.create(url, '_system');
      } else {
        const browser = this.iab.create('https://' + url, '_system');
      }
  }

}
