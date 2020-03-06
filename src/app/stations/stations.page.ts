import { StationsService } from './stations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.page.html',
  styleUrls: ['./stations.page.scss'],
})
export class StationsPage implements OnInit {
  stations = [];
  isLoading = true;

  constructor(private stationsService: StationsService) { }

  ngOnInit() {
    this.stationsService.fetchStations().subscribe(() => {
      this.isLoading = false;
      this.stations = this.stationsService.getStations();
    });
  }

}
