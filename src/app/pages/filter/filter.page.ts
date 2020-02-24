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
        if (this.opt === 'Media' ) {
          this.messages = this.messages.filter(x => x.isfile === true  );
        } else {
          this.messages = this.messages.filter(x => x.TagName === this.opt  );
        }
      }
    });
   }

  ngOnInit() {
  }
  
  getSentiment(sentiment) {
    if (sentiment > 0.5) {
      return 'success';
    } else if (sentiment < 0.0) {
      return 'danger';
    } else {
      return 'default';
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
  async Translate(data) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.apiService.Getoptions(data).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(async res => {
        console.log(res);
        if (res['error']) {
          const alert = await this.alertCtrl.create({
            header: 'Please Check Internet Connection',
            message: res['msg'],
            buttons: ['OK']
          });
          await alert.present();
        } else {
          const navigationExtras = {
            state: {
              res
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
