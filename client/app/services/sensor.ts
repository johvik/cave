export class Sample {
  value: number;
  time: string;
}

export class Sensor {
  _id: string;
  sensor: string;
  name: string;
  samples: Sample[];
}
