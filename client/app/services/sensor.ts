export class Sample {
  value: number;
  time: number;
}

export class Sensor {
  _id: string;
  sensor: string;
  name: string;
  samples: Sample[];
}
