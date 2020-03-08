import { StationsService } from './../../stations.service';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() st: string;
  @Input() variable: string;
  @Input() val;
  colorSlide;
  direction: 'below' | 'above';
  slideMin;
  slideMax;
  alertVal: number;
  alerts = [];

  constructor(private modalController: ModalController,
              private stationsService: StationsService) { }

  ngOnInit() {
    this.val = Number(this.val);
    this.slideMin = this.val - 30;
    this.slideMax  = this.val + 30;
  }


  getColors(current: number, slide: number) {
    let flag = '';
    flag = current > slide ? 'danger' : 'success';
    this.colorSlide = flag;
    this.direction = current >= slide ? 'below' : 'above';
    return flag;
  }

  addAlert(form: NgForm) {
    const alertObj = {};
    alertObj['station'] = this.st;
    alertObj['variable'] = form.form.value.var;
    alertObj['value'] = form.form.value.val;
    alertObj['direction'] = this.direction;

    this.alerts.push(alertObj);
    console.log(this.alerts);
    this.stationsService.setAlerts(alertObj);
    this.modalController.dismiss();
  }

}
