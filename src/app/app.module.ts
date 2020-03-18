import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Contacts } from '@ionic-native/contacts';
import * as process from 'process';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {IonicGestureConfig} from './gestures/ionic-gesture-config';
const config: SocketIoConfig = { url:   process.env.SOCKET ||
   'https://bee-socket.herokuapp.com'  , options: {} };
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/File/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { OCR } from '@ionic-native/ocr/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/Local-Notifications/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SocketIoModule.forRoot(config),  IonicStorageModule.forRoot(), HttpClientModule],
  providers: [
    Contacts,
    CallNumber,
    BrowserTab,
    LocalNotifications,
    Base64ToGallery,
    Sim,
    OCR,
    InAppBrowser,
    StatusBar,
    Clipboard,
    SplashScreen,
    Network,
    TextToSpeech,
    ImagePicker,
    MediaCapture,
    FileOpener,
    File,
    FilePath,
    Media,
    StreamingMedia,
    PhotoViewer,
    FileChooser,
    DocumentViewer,
    Downloader,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
