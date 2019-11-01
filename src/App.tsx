import React, { Component, useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Race, RaceCar, WayPointEvent } from "../types";
import { timer } from "rxjs";

interface Props {}
interface State {
  race: Race | undefined;
  listening: boolean;
}
const socket = io.connect("http://localhost:5000");

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    console.log("mount app");
    this.state = {
      race: undefined,
      listening: false
    };

    socket.on("race", (race: Race) => {
      console.log(race);
      this.setState({
        race
      });
    });
  }
  resetRace = async () => {
    const response = await fetch("/api/start/3/2", {
      method: "post"
    });
  };
  startListening = async () => {
    const response = await fetch("/api/listen", {
      method: "post"
    });
    if (response) {
      this.setState({
        listening: true
      });
    }
  };
  stopListening = async () => {
    const response = await fetch("/api/stop-listen", {
      method: "post"
    });
    if (response) {
      this.setState({
        listening: false
      });
    }
  };
  waypoint = async (car: number, waypoint: number) => {
    const response = await fetch(`/api/mock/${waypoint}/${car}`, {
      method: "get"
    });
  };

  public render() {
    return (
      <div className="App">
        <header className="App-header">leaderboard</header>
        <h2>Listening: {this.state.listening ? "YES" : "NO"} </h2>
        {this.state.race && <Main race={this.state.race} />}
        <button onClick={this.resetRace}>Reset</button>
        <button onClick={this.startListening}>Listen</button>
        <button onClick={this.stopListening}>Stop listen</button>
        <p>
          {[28, 34].map(car => (
            <div>
              {[1, 2, 3, 4].map(wp => {
                return (
                  <button
                    key={`${wp}-${car}`}
                    onClick={() => this.waypoint(car, wp)}
                  >
                    {car} - {wp}
                  </button>
                );
              })}
            </div>
          ))}
        </p>
      </div>
    );
  }
}

export default App;

function sortCars(cars: RaceCar[]): RaceCar[] {
  return cars.sort((a, b) => {
    if (b.laps - a.laps) {
      return b.currentWaypoint - a.currentWaypoint;
    }
    return b.laps - a.laps;
  });
}

const Main: React.FC<{ race: Race }> = ({ race }) => {
  return (
    <div>
      <div>Number of rounds:{race.totalLaps}</div>
      <div className="leaderBoard">
        {sortCars(race.cars).map(car => {
          return (
            <div key={car.name}>
              name: {car.name} laps: {car.laps} currentWaypoint:
              {car.currentWaypoint}
              time: <LapTimer events={car.events} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formatTime(ts: number) {
  const now = Date.now();
  const elapsed = now - ts;
  const ms = elapsed % 1000;
  const sec = Math.ceil(elapsed / 1000);
  return `${sec}.${ms}`;
}

const LapTimer: React.FC<{ events: WayPointEvent[] }> = ({ events }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const beginOfRace = events.find(e => e.waypoint === 1);
    const beginOfLap = [...events].reverse().find(e => e.waypoint === 1);
    if (!beginOfLap || !beginOfRace) return () => {};

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
