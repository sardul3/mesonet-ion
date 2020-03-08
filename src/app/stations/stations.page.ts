import { StationsService } from './stations.service';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController, IonItemSliding, IonSegment } from '@ionic/angular';

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
  myLon: number;
  myLat: number;

  constructor(private stationsService: StationsService,
              private toastController: ToastController) { }

  ngOnInit() {
      this.stationsService.fetchStations().subscribe(() => {
        this.isLoading = false;
        this.stations = this.stationsService.getStations();

        Geolocation.getCurrentPosition().then(loc => {
          this.myLat = loc.coords.latitude;
          this.myLon = loc.coords.longitude;

          this.myStations.push(this.stationsService.getNearByStations(this.myLat, this.myLon));
        });

      });


    }

ionViewWillEnter() {
 this.searchInput = '';

 this.stationsService.getMyStations().then(myStations => {
   this.myStations = myStations;
 });
 this.mode = 'all';

 if (this.mode === 'my') {
  this.stationsService.getMyStations().then(myStations => {
    this.stations = myStations;
  });
} else {
  this.stations = this.stationsService.getStations();
  console.log('stations', this.stations);
}

}

searchStations() {
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


removeStationSubscription(slidingItem: IonItemSliding, stationName: string) {
  slidingItem.close();
  this.stationsService.removeSubscription(stationName).then(st => {
    console.log('st removed');
    console.log(st);
    this.stations = st;

  });
  this.toastController.create({
    message: 'Stations removed from subscription',
    duration: 2000,
    animated: true,
    color: 'danger'
  }).then(toastEl => {
      toastEl.present();
      this.stationsService.getMyStations().then(myStations => {
        this.myStations = myStations;
      });

  });
}


segmentChanged(event, seg) {
  this.mode = event.detail.value;
  if (event.detail.value === 'my') {
    this.stationsService.getMyStations().then(myStations => {
      this.stations = myStations;
    });
  } else {
    this.stations = this.stationsService.getStations();
  }
}




}
