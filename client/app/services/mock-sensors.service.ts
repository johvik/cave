import { Sensor } from './sensor';

const SENSORS: Sensor[] = [
  { _id: "123", sensor: "temperature", name: "Living room", samples: [] },
  { _id: "456", sensor: "humidity", name: "Living room", samples: [] },
  { _id: "abc", sensor: "temperature", name: "Unknown", samples: [] }
];

export class MockSensorsService {
  getSensors() {
    return Promise.resolve(SENSORS);
  }

  getSensor(id: string) {
    return new Promise((resolve, reject) => {
      if (id == "123") {
        resolve(SENSORS[0]);
      } else {
        reject("error");
      }
    });
  }
}
