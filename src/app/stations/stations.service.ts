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
  stationDataJSON = {keys: []};


  constructor(private http: HttpClient) { }

  fetchStations() {
    return this.http.get('http://secondary.mesonet.k-state.edu/rest/stationnames/', {responseType: 'text'}).pipe(take(1), tap(res => {
      // tslint:disable-next-line: forin
      for (const line in res.split('\n')) {
          this.stations.push(res.split('\n')[line]);

          const keysValue = res.split('\n')[0];
          const keysArr = keysValue.split(',');
          this.stationDataJSON.keys = keysArr;

          const resWithoutHeader = res.split('\n');
          const values = (resWithoutHeader[line]);
          const valArr = values.split(',');
          const valueKey = valArr[0];
          const valValue = valArr;
          this.stationDataJSON[valueKey] = [ valValue ];

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

    // tslint:disable-next-line: max-line-length
    return this.http.get(`http://secondary.mesonet.ksu.edu/rest/stationdata/?stn=${stationName}&int=day&t_start=${formattedDate}&t_end=${formattedDate}`,
                  {responseType: 'text'}).pipe(take(1), tap(res => {
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

getNearByStations(lat: number, lon: number) {
  const keys = this.stationDataJSON.keys;
  const latKeyJSON = keys.indexOf('LATITUDE');
  const lonKeyJSON = keys.indexOf('LONGITUDE');
  let stationLat: number;
  let stationLon: number;
  const distances = [];
  let closest: number;
  let closestIndex: number;

  this.stations.forEach(st => {
    const stationName = st.split(',')[0];
    const stationRow = this.stationDataJSON[stationName];
    stationLat = Number(stationRow[0][latKeyJSON]);
    stationLon = Number(stationRow[0][lonKeyJSON]);
    console.log(typeof stationRow[0][lonKeyJSON])
    console.log(stationRow, typeof stationLat, typeof stationLon);

    const dx = lat - stationLat;
    const dy = lon - stationLon;
    console.log(dx, dy);

    const distance = Math.sqrt(dx * dx + dy * dy);
    distances.push(distance);
    closest = Math.min(...distances.slice(1));

    closestIndex = distances.indexOf(closest);

  });
 // return (this.stations[closestIndex].split(','))[keys.indexOf('NAME')];
  console.log(this.stations[closestIndex]);
  return this.stations[closestIndex];

}
}
