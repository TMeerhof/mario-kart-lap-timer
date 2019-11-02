import { useState } from "react";
import { Race } from "../../types";
import React from "react";

interface Props {
  race: Race;
}

const Admin: React.FC<Props> = ({ race }) => {
  const [listening, setListening] = useState(false);
  const resetRace = async () => {
    const response = await fetch("/api/start/3/2", {
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
    const response = await fetch(`/api/mock/${waypoint}/${car}`, {
      method: "get"
    });
  };
  return (
    <div>
      <header className="App-header">leaderboard admin</header>
      <h2>Listening: {listening ? "YES" : "NO"} </h2>
      <button onClick={resetRace}>Reset</button>
      <button onClick={startListening}>Listen</button>
      <button onClick={stopListening}>Stop listen</button>
      <p>
        {[26, 27, 1, 34].map(car => (
          <div>
            {[1, 2, 3, 4].map(wp => {
              return (
                <button key={`${wp}-${car}`} onClick={() => waypoint(car, wp)}>
                  {car} - {wp}
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
