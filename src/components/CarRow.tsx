import { RaceCar, WayPointEvent } from "../../types";
import React, { useEffect, useState } from "react";
import mario from "../assets/mario.png";
import peach from "../assets/peach.png";
import bowser from "../assets/bowser.png";
import luigi from "../assets/luigi.png";
import { timer } from "rxjs";

const images = {
  mario,
  peach,
  bowser,
  luigi
};

interface Props {
  car: RaceCar;
  totalLaps: number;
}

const CarRow: React.FC<Props> = ({ car }) => {
  return (
    <div key={car.name} className="row">
      <div
        className="icon"
        style={{
          backgroundImage: `url(${images[car.name]})`
        }}
      />
      <div className="data">{car.name}</div>
      <div className="data"> laps: {car.laps}</div>
      <div className="data">currentWaypoint: {car.currentWaypoint} </div>
      <div className="data big">
        <LapTimer events={car.events} />
      </div>
    </div>
  );
};

export default CarRow;

function formatTime(ts: number) {
  const now = Date.now();
  const elapsed = now - ts;
  const ms = elapsed % 1000;
  const sec = Math.ceil(elapsed / 1000);
  return `${sec}.${ms.toString().padStart(3, "0")}`;
}

const LapTimer: React.FC<{ events: WayPointEvent[] }> = ({ events }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const beginOfRace = events.find(e => e.waypoint === 1);
    const beginOfLap = [...events].reverse().find(e => e.waypoint === 1);
    if (!beginOfLap || !beginOfRace) {
      setTime("");
      return () => {};
    }

    const sub = timer(0, 90).subscribe(() => {
      const now = Date.now();
      const elapsed = now - beginOfLap.ts;
      const ms = elapsed % 1000;
      const sec = Math.ceil(elapsed / 1000);
      setTime(
        `race: ${formatTime(beginOfRace.ts)}, lap: ${formatTime(beginOfLap.ts)}`
      );
    });
    return () => {
      sub.unsubscribe();
    };
  }, [events]);
  return <div className="timer">{time}</div>;
};
