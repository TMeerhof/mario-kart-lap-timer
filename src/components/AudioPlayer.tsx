import React, { useEffect, useState } from "react";
import Sound from "react-sound";
import { Race } from "../../types";
import { carNumbers } from "../globals";

export enum PlayStatus {
  Playing = "PLAYING",
  Stopped = "STOPPED",
  Paused = "PAUSED"
}

const wayPointStart = async () => {
  carNumbers.forEach(num => {
    fetch(`/api/mock/1/${num}`, {
      method: "get"
    });
  });
};

interface Props {
  race: Race;
}

function logAll() {
  console.log(arguments);
}

function playStart(race: Race) {
  const now = Date.now();
  return now - race.ts < 10000;
}

function playFinalLap(race: Race) {
  return !!race.cars.some(car => car.laps === race.totalLaps - 1);
}

let currentRaceTs = 0;
let finalLapSounded = false;
const AudioPlayer: React.FC<Props> = ({ race }) => {
  const [start, setStart] = useState<PlayStatus>(PlayStatus.Paused);
  const [finalLap, setFinal] = useState<PlayStatus>(PlayStatus.Paused);
  if (race.ts !== currentRaceTs) {
    currentRaceTs = race.ts;
    finalLapSounded = false;
    if (playStart(race) && start !== PlayStatus.Playing) {
      setStart(PlayStatus.Playing);
    }
  }
  if (playFinalLap(race) && !finalLapSounded) {
    finalLapSounded = true;
    setFinal(PlayStatus.Playing);
  }
  return (
    <div>
      <Sound
        url={"/start.mp3"}
        playStatus={start}
        onLoading={logAll}
        onPlaying={logAll}
        onFinishedPlaying={() => {
          setStart(PlayStatus.Paused);
          wayPointStart();
        }}
      />
      <Sound
        url={"/final-lap.mp3"}
        playStatus={finalLap}
        onLoading={logAll}
        onPlaying={logAll}
        onFinishedPlaying={() => setFinal(PlayStatus.Paused)}
      />
    </div>
  );
};

export default AudioPlayer;
