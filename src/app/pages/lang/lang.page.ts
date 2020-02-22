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
        this.res = this.router.getCurrentNavigation().extras.state.res;
        this.languages =  this.res['options']['languages'];
        this.language =  this.res['options']['language'];
        this.payload.message =  this.res['message'];
      }
    });
   }
   res = '';
   modelId = '';
   languages = [];
   result = null;
   language = '';
  
   model = '';
   payload = {
    message : '',
   };

  ngOnInit() {
  }
  async translate() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.Translate(this.payload, this.modelId).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
      if (res) {
      this.result = res['result'];
      console.log(res);
      }
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Translation failed',
        message: err.error.msg,
        buttons: ['OK']
      });
      await alert.present();
    });
  }

}
