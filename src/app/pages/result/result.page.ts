import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  message = null;
  group = null;
  options = [];
  x = '';
  y = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.message = this.router.getCurrentNavigation().extras.state.data;
        this.group = this.router.getCurrentNavigation().extras.state.group;
        this.options = this.message.options;
      }
    });
   }
  ngOnInit() {
    //this.x=JSON.stringify(this.message);
    this.y=JSON.stringify(this.options);
  }

}
