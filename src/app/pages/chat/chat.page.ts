import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ToastController, AlertController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
//  =====>
import { FilePath } from '@ionic-native/file-path/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
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
//   ====>

const API_STORAGE_KEY = 'specialkey';
const MEDIA_FOLDER_NAME = 'my_media';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {
  files = [];
  isTyping = false;
  TypingText = '';
  userdata = '';
  data = {
    to: '',
    from: '',
    message: ''
  };
  TimeNow = new Date();
  muted = true;
  messages = [];
  // tslint:disable-next-line: max-line-length
  constructor( private imagePicker: ImagePicker,
               private mediaCapture: MediaCapture,
               private file: File,
               private media: Media,
               private streamingMedia: StreamingMedia,
               private photoViewer: PhotoViewer,
               private fileChooser: FileChooser,
               private filePath: FilePath,
               private plt: Platform, private tts: TextToSpeech, public actionSheetController: ActionSheetController , private loadingCtrl: LoadingController, public alertCtrl: AlertController, private apiService: ApiService, private route: ActivatedRoute, private toastCtrl: ToastController, private router: Router, private socket: Socket) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.userdata = this.router.getCurrentNavigation().extras.state.contact;
      }
    });

  }

  ngOnInit() {
    this.plt.ready().then(() => {
      const path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          this.loadFiles();
        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    });
    this.loadData(true);
    const fchannel =  this.data.from + '-' + this.data.to;
    const tchannel =  this.data.to + '-' + this.data.from;
    this.socket.fromEvent(fchannel).subscribe(message => {
      // tslint:disable-next-line: no-string-literal
      console.log(message);
      if (message['isTyping']) {
       console.log('typing');
     }
      if (message['isnTyping']) {
       console.log('ntyping');
     }
      if (message['isTagged']) {
       console.log('Tagged');
       this.messages[message['index']] = message;
       this.UpdateMessageInLocalStorage(true);
     }
      if (message['isDeleted']) {
       console.log('Deleted');
       this.messages[message['index']] = message;
       this.UpdateMessageInLocalStorage(true);
     }
      if (message['isMessage']) {
        this.messages.push(message);
        if (!this.muted) {
          this.tts.speak(message['message'])
          .then(() => console.log('Success'))
          .catch((reason: any) => console.log(reason));
        }
        this.UpdateMessageInLocalStorage(true);
     }

    });
    this.socket.fromEvent(tchannel).subscribe(message => {
         // tslint:disable-next-line: no-string-literal
         console.log(message);
         if (message['isTyping']) {
           this.isTyping = true;
           this.TypingText = message['message'];
        }
         if (message['isnTyping']) {
          this.isTyping = false;
          this.TypingText = message['message'];
        }
         if (message['isTagged']) {
          console.log('Tagged');
          this.loadData(true);
          this.UpdateMessageInLocalStorage(true);
        }
         if (message['isDeleted']) {
          console.log('Deleted');
          this.loadData(true);
          this.UpdateMessageInLocalStorage(true);
        }
         if (message['isMessage']) {
          this.messages.push(message);
          if (!this.muted) {
            this.tts.speak(message['message'])
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
          }
          this.UpdateMessageInLocalStorage(true);
        }

    });
  }

  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );
  }

   loadData(refresh = false, refresher?) {
    this.data.from = this.route.snapshot.paramMap.get('phoneNumber');
    this.data.to = this.route.snapshot.paramMap.get('phoneNumber2');
    this.apiService.getMessages(refresh, this.data).subscribe(res => {
      this.messages = res;
      console.log(res);
      if (refresher) {
        refresher.target.complete();
      }
    });
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


   sendMessage() {
    this.socket.emit('send-message', this.data);
    console.log(this.data);
    this.data.message = '';
   }
   UpdateMessageInLocalStorage(refresh = false, refresher?) {
    this.apiService.UpdateLocalMessages(refresh, this.data).subscribe(res => {
     // this.messages2 = res;
     // console.log(res);
      if (refresher) {
        refresher.target.complete();
      }
    });
   }


   async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  ShowMessage(message) {
    if (message.isBan === true) {
      this.showToast('In Desiciplinary act');
      this.tts.speak('In Desiciplinary act')
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
    } else {
      this.tts.speak(message.message)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
    }

  }


  TypeChecker(ev: CustomEvent) {
    const val = ev.detail.value;
    console.log(val);
    if (val && val.trim() !== '') {
      this.socket.emit('typing', this.data);
    } else {
      this.socket.emit('ntyping', this.data);
    }
  }

  async ShowOptions(message) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
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
            if (data.from === this.data.from ) {
              data.Option = 'isDeletedByMe';
            } else {
              data.Option = 'isDeletedByYou';
            }
            console.log(data);
            this.socket.emit('deleted', data);
          }
        },
        {
          text: 'Tag Message',
          icon: 'pricetag',
          handler: () => {
            if (data.from === this.data.from ) {
              this.Tag(data);
            } else {
              alert('you can Tag messages sent by you only');
            }
          }
        }
        , {
          text: 'Translate to English',
          icon: 'eye',
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

    this.apiService.Translate(data).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(async res => {
        console.log(res);
        if (res['error']) {
          const alert = await this.alertCtrl.create({
            header: 'Language Translation Failed',
            message: res['msg'],
            buttons: ['OK']
          });
          await alert.present();
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Translation Completed',
            message: '<ion-button size=\'small\' color=\'secondary\'>' + res['language'] + '</ion-button>' + res['message'] + '<br><ion-button size=\'small\' color=\'tertiary\'>English</ion-button> ' + res['result'],
            buttons: ['OK']
          });
          await alert.present();
        }

      });
  }


  async Tag(data) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Tag the Message as',
      buttons: [ {
        text: 'Important',
        handler: () => {
          data.TagName = 'Important';
          this.socket.emit('tagged', data);
        }
      }, {
        text: 'Personal',
        handler: () => {
          data.TagName = 'Personal';
          this.socket.emit('tagged', data);
        }
      }, {
        text: 'Confidential',
        handler: () => {
          data.TagName = 'Confidential';
          this.socket.emit('tagged', data);
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
  getColor(str) {
    if (str === 'Important') {
      return 'primary';
    } else if (str === 'Personal') {
      return 'tertiary';
    } else if (str === 'Confidential') {
      return 'dark';
    }
   }
   speaker() {
     this.muted = !this.muted;
   }

   async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      buttons: [
        {
          text: 'Capture Image',
          handler: () => {
            this.captureImage();
          }
        },
        {
          text: 'Record Video',
          handler: () => {
            this.recordVideo();
          }
        },
        {
          text: 'Record Audio',
          handler: () => {
            this.recordAudio();
          }
        },
        {
          text: 'Load multiple',
          handler: () => {
            this.pickImages();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  pickImages() {
    this.imagePicker.getPictures({}).then(
      results => {
        for (let i = 0; i < results.length; i++) {
          this.copyFileToLocalDir(results[i]);
        }
      }
    );

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }

  captureImage() {
    this.mediaCapture.captureImage().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }

  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
  copyFileToLocalDir2(fullPath) {
    // Make sure we copy from the right location
    this.filePath.resolveNativePath(fullPath)
  .then((filePath) => {
     const myPath = filePath;
     const ext = myPath.split('.').pop();
     const d = Date.now();
     const newName = `${d}.${ext}`;

     const name = myPath.substr(myPath.lastIndexOf('/') + 1);
     const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
     const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

     this.file.copyFile(copyFrom, name, copyTo, newName).then(
       success => {
         this.loadFiles();
       },
       error => {
         console.log('error: ', error);
       }
     );

    })
  .catch(err => console.log(err));


  }

  openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1  || f.name.indexOf('.mp3') > -1  ) {
      // We need to remove file:/// from the path for the audio plugin to work
      const path =  f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      // E.g: Use the Photoviewer to present an Image
      this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }

  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }
  async uploadFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    const type = this.getMimeType(f.name.split('.').pop());
    const buffer = await this.file.readAsArrayBuffer(path, f.name);
    const fileBlob = new Blob([buffer], type);
    const formData = new FormData();
    formData.append('file', fileBlob, f.name);
    this.uploadFileData(formData,f);
  }
  async uploadFileData(formData: FormData,f) {

    const loading = await this.loadingCtrl.create();
    loading.present();

    this.apiService.Upload(formData).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(async res => {
        console.log(res);
        if (!res['success']) {
          const alert = await this.alertCtrl.create({
            header: res['message'] ,
            message: res['msg'],
            buttons: ['OK']
          });
          await alert.present();
        } else {
         let  payload = {
            to : this.data.to,
            from : this.data.from,
            isfile : true,
            ext: res['ext'],
            mimetype: res['mimetype'],
            file: res['file'],
            original: res['original'],
            type: res['type'],
            message : ' '
          };
          this.deleteFile(f);
         this.socket.emit('send-message', payload);
         const alert = await this.alertCtrl.create({
            header:   res['ext'] + '  ' + res['message'] + '  ' + res['file'] + '  ' + res['original'],
            message: res['message'],
            buttons: ['OK']
          });
         await alert.present();

        }

      });
}

FileUpload() {
  this.fileChooser.open()
  .then((uri) => {
    alert(uri);
    this.copyFileToLocalDir2(uri);
  })
  .catch(e => alert(e));
}

  getMimeType(fileExt) {
    if (fileExt == 'wav') { return { type: 'audio/wav' }; }
    else if (fileExt == 'jpg') { return { type: 'image/jpg' }; }
    else if (fileExt == 'mp4') { return { type: 'video/mp4' }; }
    else if (fileExt == 'avi') { return { type: 'video/x-msvideo' }; }
    else if (fileExt == 'css') { return { type: 'text/css' }; }
    else if (fileExt == 'csv') { return { type: 'text/csv' }; }
    else if (fileExt == 'doc') { return { type: 'application/msword' }; }
    else if (fileExt == 'docx') { return { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }; }
    else if (fileExt == 'gif') { return { type: 'image/gif' }; }
    else if (fileExt == 'html') { return { type: 'text/html' }; }
    else if (fileExt == 'jpg') { return { type: 'image/jpeg' }; }
    else if (fileExt == 'jpeg') { return { type: 'image/jpeg' }; }
    else if (fileExt == 'js') { return { type: 'text/javascript' }; }
    else if (fileExt == 'json') { return { type: 'application/json' }; }
    else if (fileExt == 'mp3') { return { type: 'audio/mpeg' }; }
    else if (fileExt == 'mpeg') { return { type: 'video/mpeg' }; }
    else if (fileExt == 'png') { return { type: 'image/png' }; }
    else if (fileExt == 'pdf') { return { type: 'application/pdf' }; }
    else if (fileExt == 'php') { return { type: 'application/php' }; }
    else if (fileExt == 'ppt') { return { type: 'application/vnd.ms-powerpoint' }; }
    else if (fileExt == 'pptx') { return { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }; }
    else if (fileExt == 'rar') { return { type: 'application/vnd.rar' }; }
    else if (fileExt == 'svg') { return { type: 'image/svg+xml' }; }
    else if (fileExt == 'xls') { return { type: 'application/vnd.ms-excel' }; }
    else if (fileExt == 'xlsx') { return { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }; }
    else if (fileExt == 'xml') { return { type: 'application/xml' }; }
    else if (fileExt == 'zip') { return { type: 'application/zip' }; }
    else if (fileExt == '3gp') { return { type: 'video/3gpp' }; }
    else if (fileExt == '7z') { return { type: 'application/x-7z-compressed' }; }
    else if (fileExt == 'txt') { return { type: 'text/plain' }; }
  }

}
