import { StationsService } from './stations.service';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-stations',
  templateUrl: './stations.page.html',
  styleUrls: ['./stations.page.scss'],
})
export class StationsPage implements OnInit {
  stations = [];
  isLoading = true;
  searchInput: string;

  constructor(private stationsService: StationsService) { }

  ngOnInit() {
      this.stationsService.fetchStations().subscribe(() => {
        this.isLoading = false;
        this.stations = this.stationsService.getStations();
      });

      const coordinates = Geolocation.getCurrentPosition();
      console.log('Current', coordinates);
    }

ionViewWillEnter() {
 this.stations = this.stationsService.getStations();

}

searchStations() {
  console.log(this.searchInput);
  this.stations = this.stationsService.filterStationsBySearch(this.searchInput);
}



}
