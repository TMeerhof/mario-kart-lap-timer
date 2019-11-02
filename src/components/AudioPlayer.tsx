import React from "react";
import Sound from "react-sound";
import * as start from "../assets/start.mp3";

interface Props {
  music: boolean;
  effect: string;
}
function logAll() {
  console.log(arguments);
}

const AudioPlayer: React.FC<Props> = ({ music, effect }) => {
  return (
    <div>
      <Sound
        url={"../assets/start.mp3"}
        playStatus={Sound.status.PLAYING}
        playFromPosition={300 /* in milliseconds */}
        onLoading={logAll}
        onPlaying={logAll}
        onFinishedPlaying={logAll}
      />
    </div>
  );
};

export default AudioPlayer;
