import { useState } from "react";
import { Race } from "../../types";
import React from "react";

interface Props {
  race: Race;
}

const numbers = {
  mario: 27,
  peach: 26,
  bowser: 34,
  luigi: 1
};

const names = Object.keys(numbers);

const Admin: React.FC<Props> = ({ race }) => {
  const [listening, setListening] = useState(false);
  const resetRace = async () => {
    const response = await fetch("http://10.70.16.47:5000/api/start/3/2", {
      method: "post"
    });
  };
  const stopRace = async () => {
    const response = await fetch("/api/stop", {
      method: "post"
    });
  };
  const startListening = async () => {
    const response = await fetch("/api/listen", {
      method: "post"
    });
    if (response) {
      setListening(true);
    }
  };
  const stopListening = async () => {
    const response = await fetch("/api/stop-listen", {
      method: "post"
    });
    if (response) {
      setListening(false);
    }
  };
  const waypoint = async (car: number, waypoint: number) => {
    const response = await fetch(
      `http://10.70.16.47:5000/api/mock/${waypoint}/${car}`,
      {
        method: "get"
      }
    );
  };
  return (
    <div>
      <header className="App-header">leaderboard admin</header>
      <h2>Listening: {listening ? "YES" : "NO"} </h2>
      <button onClick={resetRace}>Reset</button>
      <button onClick={startListening}>Listen</button>
      <button onClick={stopListening}>Stop listen</button>
      <p>
        {names.map(name => (
          <div>
            {[1, 2, 3].map(wp => {
              return (
                <button
                  key={`wp-${wp}-${name}`}
                  onClick={() => waypoint(numbers[name], wp)}
                >
                  {name} - {wp}
                </button>
              );
            })}
          </div>
        ))}
      </p>
    </div>
  );
};

export default Admin;
