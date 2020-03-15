import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {
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

  constructor(private plt: Platform, private base64ToGallery: Base64ToGallery, private toastCtrl: ToastController) {}

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
  /*  const canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;*/
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
    this.ctx.lineWidth = 2;

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
  setBackground() {
    let background = new Image();
    background.src = './assets/code.png';
    let ctx = this.canvasElement.getContext('2d');
 
    background.onload = () => {
      ctx.drawImage(background,0,0, this.canvasElement.width, this.canvasElement.height);   
    }
  }

  exportCanvasImage() {
    const dataUrl = this.canvasElement.toDataURL();

    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.plt.is('cordova')) {
      const options: Base64ToGalleryOptions = { prefix: 'canvas_', mediaScanner:  true };
 
      this.base64ToGallery.base64ToGallery(dataUrl, options).then(
        async res => {
          const toast = await this.toastCtrl.create({
            message: 'Image saved to camera roll.',
            duration: 2000
          });
          toast.present();
        },
        err => console.log('Error saving image to gallery ', err)
      );

    } else {
      var data = dataUrl.split(',')[1];
      let blob = this.b64toBlob(data, 'image/png');
   
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'canvasimage.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
}
