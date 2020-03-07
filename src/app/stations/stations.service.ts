import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {take, tap} from 'rxjs/operators';
import { TouchSequence } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class StationsService {
  stations = [];
  stationData = [];
  myStations = [];


  constructor(private http: HttpClient) { }

  fetchStations() {
    return this.http.get('http://secondary.mesonet.k-state.edu/rest/stationnames/', {responseType: 'text'}).pipe(take(1), tap(res => {
      // tslint:disable-next-line: forin
      for (const line in res.split('\n')) {
          this.stations.push(res.split('\n')[line]);
      }
    }));
  }

  getStations() {
    return this.stations.slice(1);
  }

  appendLeadingZeroes(n: number) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  fetchStationData(stationName: string) {
    const date = new Date();
    // tslint:disable-next-line: max-line-length
    const formattedDate = date.getFullYear() + '' + this.appendLeadingZeroes((date.getMonth() + 1)) + '' + this.appendLeadingZeroes(date.getDate()) + '000000';
    console.log(formattedDate);

    // tslint:disable-next-line: max-line-length
    return this.http.get(`http://secondary.mesonet.ksu.edu/rest/stationdata/?stn=${stationName}&int=day&t_start=${formattedDate}&t_end=${formattedDate}`,
                  {responseType: 'text'}).pipe(take(1), tap(res => {
                    console.log(res);
                    // tslint:disable-next-line: forin
                    for (const line in res.split('\n')) {
                      this.stationData.push(res.split('\n')[line]);
                  }
                  }));
  }

  getStationData() {
    return this.stationData.slice(1);
  }

  subscribeStation(name: string) {
    this.myStations.push(name);
  }

  getMyStations() {
    return this.myStations;
  }

  isSubscribed(stationName: string) {
    let flag = false;
    this.myStations.map(st => {
      if ( st.split(',')[0].toLowerCase() === stationName.toLowerCase()) {
        flag = true;
        return;
      }
    });
    return flag;
  }

  filterStationsBySearch(searchTerm: string, segmentMode: string) {
    if (segmentMode === 'all') {
      return this.stations.filter((st, index) => {
        return (st.split(',')[0].toLowerCase()).startsWith(searchTerm.toLowerCase()) && index > 0;
      });
    } else {
      return this.myStations.filter((st, index) => {
        return (st.split(',')[0].toLowerCase()).startsWith(searchTerm.toLowerCase()) && index > 0;
    });
  }
}
}
