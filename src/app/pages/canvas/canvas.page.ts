import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '../../services/api.service';
import {  AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.page.html',
  styleUrls: ['./canvas.page.scss'],
})
export class CanvasPage implements AfterViewInit {
  data = {
    to: '',
    from: '',
    message: '',
    myloc :''
  };
  
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  private ctx: CanvasRenderingContext2D;
  private position: DOMRect;
  drawing = false;

  selectedColor = '#9e2956';
  colors = [ '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];
  lineWidth = 5;

  constructor( private plt: Platform, private tts: TextToSpeech, public actionSheetController: ActionSheetController, private loadingCtrl: LoadingController, public alertCtrl: AlertController, private apiService: ApiService, private route: ActivatedRoute, private toastCtrl: ToastController, private router: Router, private socket: Socket, private base64ToGallery: Base64ToGallery) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.data.to = this.router.getCurrentNavigation().extras.state.data.to;
      this.data.from = this.router.getCurrentNavigation().extras.state.data.from;
      this.data.message = this.router.getCurrentNavigation().extras.state.data.message;
    }
  }
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    this.drawing = true;
    console.log('started'+this.drawing);
    this.saveX = ev.touches[0].pageX - this.position.x;
    this.saveY = ev.touches[0].pageY - this.position.y
  }

  endDrawing() {

    this.drawing = false;
    console.log('ended' +this.drawing);
  }

  moved(ev) {
    console.log('moving' +this.drawing);
    if (!this.drawing) return;
    const currentX = ev.touches[0].pageX - this.position.x;
    const currentY = ev.touches[0].pageY - this.position.y;

    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.lineWidth = this.lineWidth;

    this.ctx.beginPath();
    this.ctx.moveTo(this.saveX, this.saveY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.closePath();

    this.ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }
  ionViewDidEnter () {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.position = this.canvas.nativeElement.getBoundingClientRect();
}

  exportCanvasImage() {
    var dataUrl = this.canvasElement.toDataURL();

    // Clear the current canvas
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
       const options: Base64ToGalleryOptions = { prefix: 'canvas_', mediaScanner: true };
       this.base64ToGallery.base64ToGallery(dataUrl, options).then(
         async res => {
         this.data.myloc = res;
         },
         err => console.log('Error saving image to gallery ', err)
       );
    var data = dataUrl.split(',')[1];
    const name = Date.now() + '.png';
    let blob = this.b64toBlob(data, 'image/png');
    const formData = new FormData();
    formData.append('file', blob, name);
    this.uploadFileData(formData);

  }

  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  async uploadFileData(formData: FormData) {

    const loading = await this.loadingCtrl.create();
    loading.present();

    this.apiService.Upload(formData).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(async res => {
        console.log(res);
        if (!res['success']) {
          const alert = await this.alertCtrl.create({
            header: res['message'],
            message: res['msg'],
            buttons: ['OK']
          });
          await alert.present();
        } else {
          let payload = {
            to: this.data.to,
            from: this.data.from,
            isfile: true,
            ext: res['ext'],
            mimetype: res['mimetype'],
            file: res['file'],
            original: res['original'],
            type: res['type'],
            myloc: this.data.myloc,
            urloc: null,
            message: ' '
          };
          this.socket.emit('send-message', payload);
          this.router.navigate(['chat']);

        }

      });
  }
}