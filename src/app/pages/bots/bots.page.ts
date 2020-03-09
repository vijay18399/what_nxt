import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-bots',
  templateUrl: './bots.page.html',
  styleUrls: ['./bots.page.scss'],
})
export class BotsPage implements OnInit {

  constructor( private router : Router) { }

  ngOnInit() {
  }
  open() {
    this.router.navigate(['bot']);
  }
}
