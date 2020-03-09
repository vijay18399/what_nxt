import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { finalize } from 'rxjs/operators';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file';
import { Downloader, NotificationVisibility } from '@ionic-native/downloader/ngx';
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Socket } from 'ngx-socket-io';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  muted = false;
  messages = [];
  opt = '';
  name = '';
  data = null;
  groupname = '';
  user = null;
  count = null;
  // tslint:disable-next-line: max-line-length
  constructor(private imagePicker: ImagePicker,
              private mediaCapture: MediaCapture,
              private file: File,
              private media: Media,
              private streamingMedia: StreamingMedia,
              private photoViewer: PhotoViewer,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private document: DocumentViewer,
              private downloader: Downloader,
              private tts: TextToSpeech,
              public actionSheetController: ActionSheetController,
              private loadingCtrl: LoadingController, 
              public alertCtrl: AlertController, 
              private apiService: ApiService, 
              private route: ActivatedRoute, 
              private toastCtrl: ToastController, 
              private router: Router, 
              private socket: Socket) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.messages = this.router.getCurrentNavigation().extras.state.messages;
        this.opt = this.router.getCurrentNavigation().extras.state.opt;
        this.name = this.router.getCurrentNavigation().extras.state.user_name;
        this.data = this.router.getCurrentNavigation().extras.state.data;
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.groupname = this.router.getCurrentNavigation().extras.state.group_name;
        this.count = this.router.getCurrentNavigation().extras.state.count;
        if (this.opt === 'Media' ) {
          this.messages = this.messages.filter(x => x.isfile === true  );
        } else if (this.opt === 'Form') {
          this.messages = this.messages.filter(x => x.isForm === true  );
        } else {
          this.messages = this.messages.filter(x => x.TagName === this.opt  );
        }
      }
    });
   }

  ngOnInit() {
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
    } else{
    if (message.score > 0.5) {
      return 'success';
    } else if (message.score < 0.0) {
      return 'danger';
    } else {
      return 'default';
    }

  }
  }
  isspam(str) {
    if (str === 'spam') {
      return (true);
    } else {
      return (false);
    }
  }
  isbirthday(str) {
    str = str.toLowerCase();
    if (str.includes('happy birthday')) {
      return true;
    } else {
      return false;
    }
  }
  iscongratulation(str) {
    str = str.toLowerCase();
    if (str.includes('congratulations')) {
      return true;
    } else {
      return false;
    }
  }

  ShowMessage(message) {
    if (message.isBan === true) {
      this.showToast('In Desiciplinary act');
      this.tts.speak('In Desiciplinary act')
        .then(() => console.log('Success'))
        .catch((reason: any) => console.log(reason));
    } else if (!message.isfile) {
      if (message.from === this.data.from) {
        if (!message.isDeletedByMe && !this.muted) {
          this.tts.speak(message.message)
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
        }
      } else {

        if (!message.isDeletedByYou && !this.muted) {
          this.tts.speak(message.message)
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
        }
      }
    } else {
      if (message.type !== 'audio' && message.type !== 'video' && message.type !== 'image') {
        if (this.data.from === message.from) {
          alert('Available at ' + message.myloc);
        } else {
          if (message.isDownloaded) {
            alert('Downloaded at ' + message.urloc);
          } else {
            const request = {
              uri: 'https://letchat-upload.herokuapp.com/' + message['file'],
              title: message['original'],
              description: '',
              mimeType: message['mimeType'],
              visibleInDownloadsUi: true,
              notificationVisibility: NotificationVisibility['VisibleNotifyCompleted'],
              destinationInExternalFilesDir: {
                dirType: 'Downloads',
                subPath: message['original']
              }
            };
            this.downloader.download(request)
              .then((location: string) => {
                message.urloc = location;
                this.socket.emit('downloaded', message);
                alert('File downloaded at :' + location);
              })
              .catch((error: any) => { alert(error); });
          }
        }

      } else {
        if (message.from === this.data.from) {
          this.openFileHere(message);
        } else {
          if (message.isDownloaded) {
            this.openFileThere(message);
          } else {
            alert('downloading file');
            const request = {
              uri: 'https://letchat-upload.herokuapp.com/' + message['file'],
              title: message['original'],
              description: '',
              mimeType: message['mimeType'],
              visibleInDownloadsUi: true,
              notificationVisibility: NotificationVisibility['VisibleNotifyCompleted'],
              destinationInExternalFilesDir: {
                dirType: 'Downloads',
                subPath: message['original']
              }
            };
            this.downloader.download(request)
              .then((location: string) => {
                message.urloc = location;
                this.socket.emit('downloaded', message);
                this.openFileThere(message);
              })
              .catch((error: any) => { alert(error); });
          }

        }

      }
    }

  }

  openFileHere(message) {
    if (message.type === 'audio') {
      // We need to remove file:/// from the path for the audio plugin to work
      const path = message.myloc.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (message.type === 'video') {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(message.myloc);
    } else if (message.type === 'image') {
      // E.g: Use the Photoviewer to present an Image
      this.photoViewer.show(message.myloc, message.original);
    }
  }
  openFileThere(message) {
    if (message.type === 'audio') {
      // We need to remove file:/// from the path for the audio plugin to work
      const path = message.urloc.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (message.type === 'video') {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(message.urloc);
    } else if (message.type === 'image') {
      // E.g: Use the Photoviewer to present an Image
      this.photoViewer.show(message.urloc, message.original);
    }
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async presentActionSheet(data, i) {

    data.index = i;
    const actionSheet = await this.actionSheetController.create({
      header: 'Message',
      buttons: [
        {
          text: 'Delete Message',
          icon: 'trash',
          handler: () => {
            if (data.from === this.data.from) {
              data.Option = 'isDeletedByMe';
            } else {
              data.Option = 'isDeletedByYou';
            }
            console.log(data);
            this.socket.emit('deleted', data);
          }
        }, 
        {
          text: 'Translation',
          icon: 'language-outline',
          handler: () => {
            this.Translate(data);
          }
        }, {
          text: 'Filter Urls',
          icon: 'funnel',
          handler: () => {
            this.Detecturls(data);
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }
  async Detecturls(data) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.apiService.Detecturls(data).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(async res => {
        console.log(res);
        let message = '';
        if (res['length'] == 0) {
          message = 'No urls found';
        }
        for (let i = 0; i < res['length']; i++) {
          message = message + `<ion-anchor (onclick)="open(res[i].url)"> ${res[i].url} is ${res[i].spamcheck} <ion-anchor/><br>`;
        }
        const alert = await this.alertCtrl.create({
          header: 'Result',
          message,
          buttons: ['OK']
        });
        await alert.present();
      }, async err => {
        const alert = await this.alertCtrl.create({
          header: 'error',
          message: err.error.msg,
          buttons: ['OK']
        });
        await alert.present();
      });
  }
  
  async Translate(x) {
    const alert = await this.alertCtrl.create({
      header: 'Select Languages to translate',
      inputs: [
        {
          name: 'Hindi',
          type: 'checkbox',
          label: 'Hindi',
          value: 'hi',
          checked: false
        },

        {
          name: 'Telugu',
          type: 'checkbox',
          label: 'Telugu',
          value: 'te'
        },
        {
          name: 'English',
          type: 'checkbox',
          label: 'English',
          value: 'en'
        },
        {
          name: 'Afrikaans',
          type: 'checkbox',
          label: 'Afrikaans',
          value: 'af'
        },
        {
          name: 'Arabic',
          type: 'checkbox',
          label: 'Arabic',
          value: 'ar'
        },
        {
          name: 'Bulgarian',
          type: 'checkbox',
          label: 'Bulgarian',
          value: 'bg'
        },
        {
          name: 'Bangla',
          type: 'checkbox',
          label: 'Bangla',
          value: 'bn'
        },
        {
          name: 'Bosnian',
          type: 'checkbox',
          label: 'Bosnian',
          value: 'bs'
        },
        {
          name: 'Catalan',
          type: 'checkbox',
          label: 'Catalan',
          value: 'ca'
        },
        {
          name: 'Czech',
          type: 'checkbox',
          label: 'Czech',
          value: 'cs'
        },
        {
          name: 'Welsh',
          type: 'checkbox',
          label: 'Welsh',
          value: 'cy'
        },
        {
          name: 'Danish',
          type: 'checkbox',
          label: 'Danish',
          value: 'da'
        },
        {
          name: 'German',
          type: 'checkbox',
          label: 'German',
          value: 'de'
        },
        {
          name: 'Greek',
          type: 'checkbox',
          label: 'Greek',
          value: 'el'
        },
        {
          name: 'Spanish',
          type: 'checkbox',
          label: 'Spanish',
          value: 'es'
        },
        {
          name: 'Estonian',
          type: 'checkbox',
          label: 'Estonian',
          value: 'et'
        },
        {
          name: 'Persian',
          type: 'checkbox',
          label: 'Persian',
          value: 'fa'
        },
        {
          name: 'Finnish',
          type: 'checkbox',
          label: 'Finnish',
          value: 'fi'
        },
        {
          name: 'Filipino',
          type: 'checkbox',
          label: 'Filipino',
          value: 'fil'
        },
        {
          name: 'Fijian',
          type: 'checkbox',
          label: 'Fijian',
          value: 'fj'
        },
        {
          name: 'French',
          type: 'checkbox',
          label: 'French',
          value: 'fr'
        },
        {
          name: 'Irish',
          type: 'checkbox',
          label: 'Irish',
          value: 'ga'
        },
        {
          name: 'Hebrew',
          type: 'checkbox',
          label: 'Hebrew',
          value: 'he'
        },
        {
          name: 'Croatian',
          type: 'checkbox',
          label: 'Croatian',
          value: 'hr'
        },
        {
          name: 'Haitian Creole',
          type: 'checkbox',
          label: 'Haitian Creole',
          value: 'ht'
        },
        {
          name: 'Hungarian',
          type: 'checkbox',
          label: 'Hungarian',
          value: 'hu'
        },
        {
          name: 'Indonesian',
          type: 'checkbox',
          label: 'Indonesian',
          value: 'id'
        },
        {
          name: 'Icelandic',
          type: 'checkbox',
          label: 'Icelandic',
          value: 'is'
        },
        {
          name: 'Italian',
          type: 'checkbox',
          label: 'Italian',
          value: 'it'
        },
        {
          name: 'Japanese',
          type: 'checkbox',
          label: 'Japanese',
          value: 'ja'
        },
        {
          name: 'Kannada',
          type: 'checkbox',
          label: 'Kannada',
          value: 'kn'
        },
        {
          name: 'Korean',
          type: 'checkbox',
          label: 'Korean',
          value: 'ko'
        },
        {
          name: 'Lithuanian',
          type: 'checkbox',
          label: 'Lithuanian',
          value: 'lt'
        },
        {
          name: 'Latvian',
          type: 'checkbox',
          label: 'Latvian',
          value: 'lt'
        },
        {
          name: 'Malagasy',
          type: 'checkbox',
          label: 'Malagasy',
          value: 'mg'
        },
        {
          name: 'Maori',
          type: 'checkbox',
          label: 'Maori',
          value: 'mi'
        },
        {
          name: 'Malayalam',
          type: 'checkbox',
          label: 'Malayalam',
          value: 'ml'
        },
        {
          name: 'Malay',
          type: 'checkbox',
          label: 'Malay',
          value: 'ms'
        },
        {
          name: 'Maltese',
          type: 'checkbox',
          label: 'Maltese',
          value: 'mt'
        },
        {
          name: 'Hmong Daw',
          type: 'checkbox',
          label: 'Hmong Daw',
          value: 'mww'
        },
        {
          name: 'Norwegian',
          type: 'checkbox',
          label: 'Norwegian',
          value: 'nb'
        },
        {
          name: 'Dutch',
          type: 'checkbox',
          label: 'Dutch',
          value: 'nl'
        },
        {
          name: 'Querétaro Otomi',
          type: 'checkbox',
          label: 'Querétaro Otomi',
          value: 'otq'
        },
        {
          name: 'Punjabi',
          type: 'checkbox',
          label: 'Punjabi',
          value: 'pa'
        },
        {
          name: 'Polish',
          type: 'checkbox',
          label: 'Polish',
          value: 'pl'
        },
        {
          name: 'Portuguese (Brazil)',
          type: 'checkbox',
          label: 'Portuguese (Brazil)',
          value: 'pt'
        },
        {
          name: 'Portuguese (Portugal)',
          type: 'checkbox',
          label: 'Portuguese (Portugal)',
          value: 'pt-pt'
        },
        {
          name: 'Romanian',
          type: 'checkbox',
          label: 'Romanian',
          value: 'ro'
        },
        {
          name: 'Russian',
          type: 'checkbox',
          label: 'Russian',
          value: 'ru'
        },
        {
          name: 'Slovak',
          type: 'checkbox',
          label: 'Slovak',
          value: 'sk'
        },
        {
          name: 'Slovenian',
          type: 'checkbox',
          label: 'Slovenian',
          value: 'sl'
        },
        {
          name: 'Samoan',
          type: 'checkbox',
          label: 'Samoan',
          value: 'sm'
        },
        {
          name: 'Serbian (Cyrillic)',
          type: 'checkbox',
          label: 'Serbian (Cyrillic)',
          value: 'sr-Cyrl'
        },
        {
          name: 'Serbian (Latin)',
          type: 'checkbox',
          label: 'Serbian (Latin)',
          value: 'sr-Latn'
        },
        {
          name: 'Swedish',
          type: 'checkbox',
          label: 'Swedish',
          value: 'sv'
        },
        {
          name: 'Swahili',
          type: 'checkbox',
          label: 'Swahili',
          value: 'sw'
        },
        {
          name: 'Tamil',
          type: 'checkbox',
          label: 'Tamil',
          value: 'ta'
        },
        {
          name: 'Thai',
          type: 'checkbox',
          label: 'Thai',
          value: 'th'
        },
        {
          name: 'Klingon (Latin)',
          type: 'checkbox',
          label: 'Klingon (Latin)',
          value: 'tlh-Latn'
        },
        {
          name: 'Klingon (pIqaD)',
          type: 'checkbox',
          label: 'Klingon (pIqaD)',
          value: 'tlh-Piqd'
        },
        {
          name: 'Tongan',
          type: 'checkbox',
          label: 'Tongan',
          value: 'to'
        },
        {
          name: 'Turkish',
          type: 'checkbox',
          label: 'Turkish',
          value: 'tr'
        },
        {
          name: 'Tahitian',
          type: 'checkbox',
          label: 'Tahitian',
          value: 'ty'
        },
        {
          name: 'Ukrainian',
          type: 'checkbox',
          label: 'Ukrainian',
          value: 'uk'
        },
        {
          name: 'Urdu',
          type: 'checkbox',
          label: 'Urdu',
          value: 'ur'
        },
        {
          name: 'Vietnamese',
          type: 'checkbox',
          label: 'Vietnamese',
          value: 'vi'
        },
        {
          name: 'Yucatec Maya',
          type: 'checkbox',
          label: 'Yucatec Maya',
          value: 'yua'
        },
        {
          name: 'Cantonese (Traditional)',
          type: 'checkbox',
          label: 'Cantonese (Traditional)',
          value: 'yue'
        },
        {
          name: 'Chinese Simplified',
          type: 'checkbox',
          label: 'Chinese Simplified',
          value: 'zh-Hans'
        },
        {
          name: 'Chinese Traditional',
          type: 'checkbox',
          label: 'Chinese Traditional',
          value: 'zh-Hant'
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
            const languages = data;
            const text = x['message'];
            this.StartTranslation(languages, text);
          }
        }
      ]
    });

    await alert.present();
  }

  async StartTranslation(languages, text) {
  console.log(languages, text );
  const loading = await this.loadingCtrl.create();
  loading.present();

  this.apiService.Translate(languages, text).pipe(
    finalize(() => loading.dismiss())
  )
    .subscribe(async res => {
      if (res['statusCode'] !== 200) {
        const alert = await this.alertCtrl.create({
          header: 'Please Check Internet Connection',
          message: res['msg'],
          buttons: ['OK']
        });
        await alert.present();
      } else {
        console.log(res);
        const navigationExtras = {
          state: {
            res, text
          }
        };
        this.router.navigate(['lang'], navigationExtras);
      }

    });

  }
  speaker() {
    this.muted = !this.muted;
  }

}
