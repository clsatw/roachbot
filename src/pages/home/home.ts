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
  @ViewChild('target') target;
  @ViewChild('btnL') btnL: ElementRef;
  @ViewChild('btnR') btnR: any;
  @ViewChild('btnF') btnF: any;
  @ViewChild('btnB') btnB: any;
  // @ViewChild('btnStop') btnS: any;
  // baseUrl: string = 'https://cloud.arest.io/clsa0916/';
  constructor(private http: Http, public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    console.log(this.btnF);

    //let btn = document.querySelector('#target');
    const mouseUp$ = Observable.fromEvent(this.target.nativeElement, 'mouseup');
    const touchEnds$ = Observable.fromEvent(this.target.nativeElement, 'touchend');

    //btn = document.querySelector('#btnForward');
    const btnF$ = Observable.fromEvent(this.btnF.nativeElement, 'mousedown').mapTo('forward');
    const touchF$ = Observable.fromEvent(this.btnF.nativeElement, 'touchstart').mapTo('forward');

    //btn = document.querySelector('#btnBackward');
    const btnB$ = Observable.fromEvent(this.btnB.nativeElement, 'mousedown').mapTo('backward');
    const touchB$ = Observable.fromEvent(this.btnB.nativeElement, 'touchstart').mapTo('backward');

    //btn = document.querySelector('#btnL');
    const btnL$ = Observable.fromEvent(this.btnL.nativeElement, 'mousedown').mapTo('left');
    const touchL$ = Observable.fromEvent(this.btnL.nativeElement, 'touchstart').mapTo('left');

    //btn = document.querySelector('#btnR');
    const btnR$ = Observable.fromEvent(this.btnR.nativeElement, 'mousedown').mapTo('right');
    const touchR$ = Observable.fromEvent(this.btnR.nativeElement, 'touchstart').mapTo('right');

    //btn = document.querySelector('#btnStop');
    //const btnS$ = Observable.fromEvent(btn, 'mousedown').mapTo('stop');

    // const btnTvOff$ = Observable.fromEvent(this.btnCtrls[1].nativeElement, 'mousedown').mapTo('0');
    Observable.merge(btnF$, btnB$, btnL$, btnR$, touchB$, touchF$, touchL$, touchR$)
      .throttleTime(500)
      //.distinctUntilChanged()
      // .do(e => console.log(e))
      .switchMap(e => this.ctrlGpio(e))
      // .switchMap(e => this.http.get(`https://cloud.arest.io/${this.device_id}/${e}`))
      .subscribe(console.log);

    Observable.merge(mouseUp$, touchEnds$).switchMap(()=>this.ctrlGpio('stop')).subscribe();  
  }

  ctrlGpio(heading: string) {
    this.msg = heading; // for css
    return this.http.get(`https://pro.arest.io/${this.device_id}/${heading}?key=${this.aRestApiKey}`);
  }
}
