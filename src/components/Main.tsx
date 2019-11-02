import React, { useEffect, useState } from "react";
import { Race, RaceCar } from "../../types";
import CarRow from "./CarRow";

const Main: React.FC<{ race: Race }> = ({ race }) => {
  return (
    <div>
      <div>Number of rounds:{race.totalLaps}</div>
      <div className="leaderBoard">
        {sortCars(race.cars).map(car => (
          <CarRow car={car} totalLaps={race.totalLaps} />
        ))}
      </div>
    </div>
  );
};

export default Main;

function sortCars(cars: RaceCar[]): RaceCar[] {
  return cars.sort((a, b) => {
    if (b.laps === a.laps) {
      if (b.currentWaypoint === a.currentWaypoint) {
        return (
          a.events[a.events.length + 1] &&
          b.events[b.events.length + 1] &&
          b.events[b.events.length + 1].ts - a.events[a.events.length + 1].ts
        );
      }
      return b.currentWaypoint - a.currentWaypoint;
    }
    return b.laps - a.laps;
  });
}
