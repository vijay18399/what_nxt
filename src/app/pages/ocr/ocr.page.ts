import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import anchorme from 'anchorme';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.page.html',
  styleUrls: ['./ocr.page.scss'],
})
export class OcrPage implements OnInit {
  result = null;
  url = '';
  FinalResult = '';
  x = '';
  urls = [];
  numbers = [];
  l = null;
  isurl = false;
   constructor(private callNumber: CallNumber, private iab: InAppBrowser, private browserTab: BrowserTab, private clipboard: Clipboard, private route: ActivatedRoute, private toastCtrl: ToastController, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.result = this.router.getCurrentNavigation().extras.state.result.blocks.blocktext;

        this.url = this.router.getCurrentNavigation().extras.state.url;
        this.LoadResult();
      }
    });

  }

  ngOnInit() {
    this.LoadResult();
  }


  LoadResult() {
    const x = this.result.join(' ');
    this.FinalResult = x;
    this.urls = anchorme(this.FinalResult, { list: true });
    this.numbers = this.Extractor(this.FinalResult, false);
  }
  copy() {
    this.clipboard.copy(this.FinalResult);
  }

  open(url) {
    console.log(url);
    if (url.reason === 'url') {
      const Regex = /^(http|https)/;
      if (Regex.test(url.raw) === true) {
        const browser = this.iab.create(url.raw, '_system');
      } else {
        const browser = this.iab.create('https://' + url.raw, '_system');
      }
    } else {
      alert('Seems to be email');
    }
  }
  copier(url) {
    this.clipboard.copy(url.raw);
  }
  openNumber(num) {
    this.callNumber.callNumber(num, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => alert('failed to launch dialer'));
  }
  Extractor(text, options) {
    let numbers;
    options = options || {};
    if (!text || typeof text !== 'string') {
      return [];
    }

    numbers = text.match(/(-\d+|\d+)(,\d+)*(\.\d+)*/g);

    if (options.string === false) {
      numbers = numbers.map(n => Number(n.replace(/,/g, '')));
    }

    return numbers;
  }


}
