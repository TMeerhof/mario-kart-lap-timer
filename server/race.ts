import { Subject, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WayPointEvent, Race, RaceCar } from "../types";

const raceDone = new Subject();

export const race = new ReplaySubject<Race>();

function emptyRace(totalLaps: number = 3): Race {
  function base() {
    return {
      currentWaypoint: 0,
      laps: 0,
      events: []
    };
  }
  return {
    totalLaps,
    cars: [
      {
        name: "mario",
        number: 27,
        ...base()
      },
      {
        name: "peach",
        number: 26,
        ...base()
      },
      {
        name: "bowser",
        number: 34,
        ...base()
      },
      {
        name: "luigi",
        number: 1,
        ...base()
      }
    ]
  };
}

let currentRace: Race;

interface RaceData {}
export function startNewRace(
  eventStream: Subject<WayPointEvent>,
  totalLaps: number,
  players: number = 2
) {
  raceDone.next();
  currentRace = emptyRace(totalLaps);
  race.next(currentRace);
  eventStream.pipe(takeUntil(raceDone)).subscribe(parseEvent);
}

const numberOfWaypoints = 3;

function updateRace() {
  race.next(currentRace);
}

function parseEvent(event: WayPointEvent) {
  console.log(event);
  const car = getCar(event.car);
  if (!car || event.waypoint > numberOfWaypoints || event.waypoint < 1) {
    return;
  }
  if (event.waypoint === 1 && car.currentWaypoint === numberOfWaypoints) {
    car.laps += 1;
    car.currentWaypoint = 1;
    car.events.push(event);
    updateRace();
  }
  if (event.waypoint - car.currentWaypoint === 1) {
    car.currentWaypoint += 1;
    car.events.push(event);
    updateRace();
  }
}

function getCar(number: number): RaceCar | undefined {
  return currentRace.cars.find(c => c.number === number);
}
