  import { StationsService } from './../stations.service';
  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { NavController } from '@ionic/angular';

  @Component({
    selector: 'app-station-detail',
    templateUrl: './station-detail.page.html',
    styleUrls: ['./station-detail.page.scss'],
  })
  export class StationDetailPage implements OnInit {
    station: string;
    isLoading = true;
    stationData = null;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private stationsService: StationsService) { }

    ngOnInit() {
      // tslint:disable-next-line: deprecation
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('stationId')) {
          this.navCtrl.navigateBack('/places/tabs/offers');
          return;
        }
        this.station = paramMap.get('stationId');
        this.stationsService.fetchStationData(this.station).subscribe(() => {
          this.isLoading = false;
          //this.stationData = this.stationsService.getStationData();
          this.stationData = this.stationsService.getStData(this.station);
          console.log('from ts file data', this.stationData);
        });
    });

  }

  ionViewWillEnter() {
    this.stationData = this.stationsService.getStationData();
   }

   sortByJSONOrder() {
     
   }

  }
