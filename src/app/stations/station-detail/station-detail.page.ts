  import { StationsService } from './../stations.service';
  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { NavController, IonSegment, IonItemSliding, ModalController } from '@ionic/angular';
  import { ModalPage } from './modal/modal.page';

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
                private stationsService: StationsService,
                private modalController: ModalController) { }

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
          this.stationData = this.stationsService.getStData(this.station);
          console.log('from ts file data', this.stationData);
        });
    });

  }

  ionViewWillEnter() {
    this.stationData = this.stationsService.getStationData();
   }

   sortByJSONOrder() { }

   addAlert(slidingItem: IonItemSliding, subscriptionParams, station: string) {
     slidingItem.close();
     console.log(subscriptionParams);
     console.log(station);

     this.modalController.create({
        component: ModalPage,
        componentProps: {
          st: station,
          variable: subscriptionParams.key,
          val: subscriptionParams.value
        }
     }).then(modalEl => {
       modalEl.present();
     })

   }

  }
