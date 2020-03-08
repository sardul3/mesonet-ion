import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {take, tap} from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class StationsService {
  stations = [];
  stationData = [];
  myStations = [];
  stationDataJSON = {keys: []};
  stDataJSON = {keys: []};



  constructor(private http: HttpClient) { }

  async setAlerts(alertObj) {
    let alertsArr = [];
    if ( (await Storage.get({ key: 'alerts' })).value) {
      alertsArr = JSON.parse((await Storage.get({ key: 'alerts' })).value);
    }
    alertsArr.push(alertObj);

    Storage.set({
      key: 'alerts',
      value: JSON.stringify(alertsArr)
    });
  }

  async getValuesFromStore(id: string) {
    const res = await Storage.get({key: id});
    const values = JSON.parse(res.value);
    return values;
  }

  fetchStations() {
    return this.http.get('http://secondary.mesonet.k-state.edu/rest/stationnames/', {responseType: 'text'}).pipe(take(1), tap( res => {

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

  setStations() {
    // const returnData = {name: '', county: ''};
    // returnData.name = valValue[keysArr.indexOf('NAME')];
    // returnData.county = valValue[keysArr.indexOf('COUNTY')];
    // let stationsArr = [];
    // if ( (await Storage.get({ key: 'stations' })).value) {
    //   stationsArr = JSON.parse((await Storage.get({ key: 'stations' })).value);
    // }
    // stationsArr.push(returnData);

    // Storage.set({
    //   key: 'stations',
    //   value: JSON.stringify(stationsArr)
    // });
    // return this.getValuesFromStore('stations');

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

                      const keysValue = res.split('\n')[0];
                      const keysArr = keysValue.split(',');
                      this.stDataJSON.keys = keysArr;

                      const resWithoutHeader = res.split('\n');
                      const values = (resWithoutHeader[line]);
                      const valArr = values.split(',');
                      const valueKey = valArr[1];
                      const valValue = valArr;
                      this.stDataJSON[valueKey] = [ valValue ];
                  }
                  }));
  }

  getStationData() {
    return this.stationData.slice(1);
  }

  getStData(stationName: string) {
    const returnedData = {};
    const keys = this.stDataJSON.keys;
    keys.forEach(key => {
      const keyName = keys[keys.indexOf(key)];
      const keyIndex = keys.indexOf(keyName);
      const stationRow = this.stDataJSON[stationName];
      returnedData[keyName] = stationRow[0][keyIndex];
    });
    return returnedData;
  }

  async subscribeStation(name: string) {
    this.myStations.push(name);

    let myStationsArr = [];
    if ( (await Storage.get({ key: 'myStations' })).value) {
      myStationsArr = JSON.parse((await Storage.get({ key: 'myStations' })).value);
    }
    myStationsArr.push(name);

    Storage.set({
      key: 'myStations',
      value: JSON.stringify(myStationsArr)
    });



  }

  async removeSubscription(name: string) {
    let myStationsArr = JSON.parse((await Storage.get({ key: 'myStations' })).value);
    myStationsArr = myStationsArr.filter(st => {
      const ind = myStationsArr.indexOf(name);
      return st !== name;
    });

    Storage.set({
      key: 'myStations',
      value: JSON.stringify(myStationsArr)
    });
    return myStationsArr;
  }

  getMyStations() {
    return this.getValuesFromStore('myStations');
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

    const dx = lat - stationLat;
    const dy = lon - stationLon;

    const distance = Math.sqrt(dx * dx + dy * dy);
    distances.push(distance);
    closest = Math.min(...distances.slice(1));

    closestIndex = distances.indexOf(closest);

  });
 // return (this.stations[closestIndex].split(','))[keys.indexOf('NAME')];
  return this.stations[closestIndex];

}
}
