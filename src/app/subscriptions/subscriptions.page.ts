import { StationsService } from './../stations/stations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage implements OnInit {
  alerts;

  constructor(private stationsService: StationsService) { }

  ngOnInit() {
    this.stationsService.getValuesFromStore('alerts').then(alerts => {
      this.alerts = alerts;
    });
  }

}
