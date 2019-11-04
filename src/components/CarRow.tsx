import { RaceCar, WayPointEvent } from "../../types";
import React, { useEffect, useState } from "react";
import mario from "../assets/mario.png";
import peach from "../assets/peach.png";
import bowser from "../assets/bowser.png";
import luigi from "../assets/luigi.png";
import { timer } from "rxjs";
import { race } from "q";

const images = {
  mario,
  peach,
  bowser,
  luigi
};

interface Props {
  car: RaceCar;
  totalLaps: number;
  position: number;
}

const CarRow: React.FC<Props> = ({ car, totalLaps, position }) => {
  const finsihed = car.laps > 1;

  return (
    <div key={car.name} className={`row position-${position}`}>
      <div className="position">{position}</div>
      <div
        className="icon"
        style={{
          backgroundImage: `url(${images[car.name]})`
        }}
      />
      <div className="data">{car.name}</div>
      <div className="data">
        {finsihed ? (
          <span className="finished">FINISH</span>
        ) : (
          <span>
            {car.laps + 1} / {totalLaps}
          </span>
        )}
      </div>
      <div className="data">
        {!finsihed && <span> waypoint: {car.currentWaypoint} </span>}
      </div>
      <div className="data big">
        {finsihed ? (
          <div className="timer">{finishtime(car)}</div>
        ) : (
          <LapTimer events={car.events} />
        )}
      </div>
    </div>
  );
};

export default CarRow;

function formatTime(ts: number, ts2: number) {
  const elapsed = ts2 - ts;
  const ms = elapsed % 1000;
  const sec = Math.ceil(elapsed / 1000);
  return `${sec}.${ms.toString().padStart(3, "0")}`;
}

function finishtime(car: RaceCar) {
  if (car.laps < 2) return "";
  const start = car.events[0].ts;
  const last = car.events[6].ts;
  return formatTime(start, last);
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
        `race: ${formatTime(beginOfRace.ts, now)}, lap: ${formatTime(
          beginOfLap.ts,
          now
        )}`
      );
    });
    return () => {
      sub.unsubscribe();
    };
  }, [events]);
  return <div className="timer">{time}</div>;
};
