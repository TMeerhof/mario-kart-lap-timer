export interface WayPointEvent {
  waypoint: number;
  car: number;
  ts: number;
}

export interface Race {
  totalLaps: number;
  cars: RaceCar[];
}

export interface RaceCar {
  name: string;
  number: number;
  currentWaypoint: number;
  laps: number;
  events: WayPointEvent[];
}

interface Waypoint {
  number: 1 | 2 | 3 | 4;
}
