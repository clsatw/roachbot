import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromEvent';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  msg: string;
  aRestApiKey = '1obqzch8x3e7e626';
  device_id = 'clsa0916';
  @ViewChild('btnL') btnL: any;
  @ViewChild('btnR') btnR: any;
  @ViewChild('btnForward') btnF: any;
  @ViewChild('btnBackward') btnB: any;
  @ViewChild('btnStop') btnS: any;
  // baseUrl: string = 'https://cloud.arest.io/clsa0916/';
  constructor(private element: ElementRef, private http: Http, public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('oninit');
    console.log('ionViewDidLoad ControlPage');

    let btn = document.querySelector('#btnForward');
    const btnF$ = Observable.fromEvent(btn, 'click').mapTo('forward');

    btn = document.querySelector('#btnBackward');
    const btnB$ = Observable.fromEvent(btn, 'click').mapTo('backward');

    btn = document.querySelector('#btnL');
    const btnL$ = Observable.fromEvent(btn, 'click').mapTo('left');

    btn = document.querySelector('#btnR');
    const btnR$ = Observable.fromEvent(btn, 'click').mapTo('right');

    btn = document.querySelector('#btnStop');
    const btnS$ = Observable.fromEvent(btn, 'click').mapTo('stop');

    // const btnTvOff$ = Observable.fromEvent(this.btnCtrls[1].nativeElement, 'click').mapTo('0');
    Observable.merge(btnF$, btnB$, btnL$, btnR$, btnS$)
      .throttleTime(500)
      .distinctUntilChanged()
      // .do(e => console.log(e))
      .switchMap(e => this.ctrlGpio(e))
      // .switchMap(e => this.http.get(`https://cloud.arest.io/${this.device_id}/${e}`))
      .subscribe(console.log);
  }


/*
  ionViewDidLoad() {

    console.log("did load");
    const btnF$ = Observable.fromEvent(this.btnL, 'click').mapTo('forward');
    const btnB$ = Observable.fromEvent(this.btnB.nativeElement, 'click').mapTo('backward');
    const btnL$ = Observable.fromEvent(this.btnL.nativeElement, 'click').mapTo('left');
    const btnR$ = Observable.fromEvent(this.btnR.nativeElement, 'click').mapTo('right');
    const btnS$ = Observable.fromEvent(this.btnS.nativeElement, 'click').mapTo('stop');
    Observable.merge(btnF$, btnB$, btnL$, btnR$, btnS$)
    .throttleTime(500)
    .distinctUntilChanged()
    // .do(e => console.log(e))
    .switchMap(e => this.ctrlGpio(e))
    // .switchMap(e => this.http.get(`https://cloud.arest.io/${this.device_id}/${e}`))
    .subscribe(console.log);
  }
*/

  ctrlGpio(heading: string) {
    this.msg = heading; // for css
    return this.http.get(`https://pro.arest.io/${this.device_id}/${heading}?key=${this.aRestApiKey}`);
  }
}
