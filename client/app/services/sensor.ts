export class Sample {
  value: number;
  date: string;
}

export class Sensor {
  _id: string;
  sensor: string;
  name: string;
  samples: Sample[];
}
