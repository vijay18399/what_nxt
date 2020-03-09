import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.page.html',
  styleUrls: ['./lang.page.scss'],
})
export class LangPage implements OnInit {

  constructor(private alertCtrl: AlertController,private api: ApiService, private loadingCtrl: LoadingController,private route: ActivatedRoute, private toastCtrl: ToastController, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.translations = this.router.getCurrentNavigation().extras.state.res.body[0].translations;
        this.detectedLanguage = this.router.getCurrentNavigation().extras.state.res.body[0].detectedLanguage.language; 
        this.x=JSON.stringify(this.router.getCurrentNavigation().extras.state.res);
        this.text=this.router.getCurrentNavigation().extras.state.text;
      }
    });
   }
   translations = [];
   x = '';
   detectedLanguage = '';
   text = '';

  ngOnInit() {
  }
   getLangName(code){
     let name = '';
     switch (code) {
      case 'hi':
          name = 'Hindi';
          break;
      case 'te':
          name = 'Telugu';
          break;
      case 'en':
          name = 'English';
          break;
      case 'af':
          name = 'Afrikaans';
          break;
      case 'ar':
          name = 'Arabic';
          break;
      case 'bg':
          name = 'Bulgarian';
          break;
      case 'bn':
          name = 'Bangla';
          break;
      case 'bs':
          name = 'Bosnian';
          break;
      case 'ca':
          name = 'Catalan';
          break;
      case 'cs':
          name = 'Czech';
          break;
      case 'cy':
          name = 'Welsh';
          break;
      case 'da':
          name = 'Danish';
          break;
      case 'de':
          name = 'German';
          break;
      case 'el':
          name = 'Greek';
          break;
      case 'es':
          name = 'Spanish';
          break;
      case 'et':
          name = 'Estonian';
          break;
      case 'fa':
          name = 'Persian';
          break;
      case 'fi':
          name = 'Finnish';
          break;
      case 'fil':
          name = 'Filipino';
          break;
      case 'fj':
          name = 'Fijian';
          break;
      case 'fr':
          name = 'French';
          break;
      case 'ga':
          name = 'Irish';
          break;
      case 'he':
          name = 'Hebrew';
          break;
      case 'hr':
          name = 'Croatian';
          break;
      case 'ht':
          name = 'Haitian Creole';
          break;
      case 'hu':
          name = 'Hungarian';
          break;
      case 'id':
          name = 'Indonesian';
          break;
      case 'is':
          name = 'Icelandic';
          break;
      case 'it':
          name = 'Italian';
          break;
      case 'ja':
          name = 'Japanese';
          break;
      case 'kn':
          name = 'Kannada';
          break;
      case 'ko':
          name = 'Korean';
          break;
      case 'lt':
          name = 'Lithuanian';
          break;
      case 'lt':
          name = 'Latvian';
          break;
      case 'mg':
          name = 'Malagasy';
          break;
      case 'mi':
          name = 'Maori';
          break;
      case 'ml':
          name = 'Malayalam';
          break;
      case 'ms':
          name = 'Malay';
          break;
      case 'mt':
          name = 'Maltese';
          break;
      case 'mww':
          name = 'Hmong Daw';
          break;
      case 'nb':
          name = 'Norwegian';
          break;
      case 'nl':
          name = 'Dutch';
          break;
      case 'otq':
          name = 'Queretaro Otomi';
          break;
      case 'pa':
          name = 'Punjabi';
          break;
      case 'pl':
          name = 'Polish';
          break;
      case 'pt':
          name = 'Portuguese(Brazil)';
          break;
      case 'pt-pt':
          name = 'Portuguese(Portugal)';
          break;
      case 'ro':
          name = 'Romanian';
          break;
      case 'ru':
          name = 'Russian';
          break;
      case 'sk':
          name = 'Slovak';
          break;
      case 'sl':
          name = 'Slovenian';
          break;
      case 'sm':
          name = 'Samoan';
          break;
      case 'sr-Cyrl':
          name = 'Serbian(Cyrillic)';
          break;
      case 'sr-Latn':
          name = 'Serbian(Latin)';
          break;
      case 'sv':
          name = 'Swedish';
          break;
      case 'sw':
          name = 'Swahili';
          break;
      case 'ta':
          name = 'Tamil';
          break;
      case 'th':
          name = 'Thai';
          break;
      case 'tlh-Latn':
          name = 'Klingon(latin)';
          break;
      case 'tlh-Piqd':
          name = 'Klingon(plqaD)';
          break;
      case 'to':
          name = 'Tongan';
          break;
      case 'tr':
          name = 'Turkish';
          break;
      case 'ty':
          name = 'Tahitian';
          break;
      case 'uk':
          name = 'Ukrainian';
          break;
      case 'ur':
          name = 'Urdu';
          break;
      case 'vi':
          name = 'Vietnamese';
          break;
      case 'yua':
          name = 'Yucatec Maya';
          break;
      case 'yue':
          name = 'Cantonese(Traditional)';
          break;
      case 'zh-Hans':
          name = 'chineses Simplified';
          break;
      case 'zh-Hant':
          name = 'Chinese Traditional';
          break;
      default:
          name = 'Unkown Language';
  }
     return name;
   }

}
