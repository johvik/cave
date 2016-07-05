import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Sensor } from './sensor';

@Injectable()
export class SensorsService {
  private sensorsUrl = 'api/sensor'

  constructor(private http: Http) { }

  getSensors() {
    return this.http.get(this.sensorsUrl)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.error('An error occurred', error);
        return Promise.reject('Failed to load sensors.');
      });
  }

  getSensor(id: string) {
    return this.http.get(this.sensorsUrl + '/' + id)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.error('An error occurred', error);
        return Promise.reject('Failed to load sensor.');
      });
  }
}
