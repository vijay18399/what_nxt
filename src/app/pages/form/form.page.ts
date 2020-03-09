import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  options = [
    {
      name : '',
      score : 0,
      votedby : []
    }
  ];
  data = {};
  question = '';
  constructor(private route: ActivatedRoute, private router: Router,  private socket: Socket) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.data = this.router.getCurrentNavigation().extras.state.data;
    }
   }

  ngOnInit() {
  }
  add() {
  const option =  {
      name : '',
      score : 0,
      votedby : []
    };
  this.options.push(option);
  }
  minus() {
    this.options.pop();
  }
  send() {
    const voters = [];
    this.data['options'] = this.options;
    this.data['question'] = this.question;
    this.data['voters'] = voters;
    this.data['isForm'] = true;
    console.log(this.options);
   this.options =  this.options.filter(x => x.name != '' );
    console.log(this.options);
    console.log(this.options.length >= 2 && this.question);
    if (this.options.length >= 2 && this.question) {
      this.socket.emit('message_in_group', this.data);
      this.router.navigate(['gchat']);
    }
    else{
      alert('question with atleast 2 options need to there');
    }
  }

}
