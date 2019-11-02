import React, { useEffect, useState } from "react";
import { Race, RaceCar } from "../../types";
import CarRow from "./CarRow";
import "./Main.css";

const Main: React.FC<{ race: Race }> = ({ race }) => {
  return (
    <div className="main">
      <div className="screen">
        <div className="leaderBoard">
          {sortCars(race.cars).map((car, i) => (
            <CarRow
              car={car}
              totalLaps={race.totalLaps}
              position={i + 1}
              key={car.name}
            />
          ))}
        </div>
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
          b.events[b.events.length + 1].ts + a.events[a.events.length + 1].ts
        );
      }
      return b.currentWaypoint - a.currentWaypoint;
    }
    return b.laps - a.laps;
  });
}
