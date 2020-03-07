import { StationsService } from './stations.service';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController, IonItemSliding } from '@ionic/angular';

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
  mode: string;
  myStations = [];

  constructor(private stationsService: StationsService,
              private toastController: ToastController) { }

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
 this.searchInput = '';
 this.myStations = this.stationsService.getMyStations();
}

searchStations() {
  console.log(this.searchInput);
  this.stations = this.stationsService.filterStationsBySearch(this.searchInput, this.mode);
}

subscribeStation(slidingItem: IonItemSliding, stationName: string) {
  slidingItem.close();
  this.stationsService.subscribeStation(stationName);
  this.toastController.create({
    message: 'Stations added to subscription',
    duration: 2000,
    animated: true,
    color: 'success'
  }).then(toastEl => {
      toastEl.present();
  });
}

segmentChanged(event) {
  console.log(event.detail.value);
  this.mode = event.detail.value;
  if (event.detail.value === 'my') {
    this.stations = this.stationsService.getMyStations();
  } else {
    this.stations = this.stationsService.getStations();
  }

}


}
