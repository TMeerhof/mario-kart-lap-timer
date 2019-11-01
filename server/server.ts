import bodyParser from "body-parser";
import express from "express";
import {
  expressMock,
  events,
  startListening,
  stopListening
} from "./waypointListener";
import { startNewRace, race } from "./race";
import socketIO from "socket.io";
import http from "http";

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startNewRace(events, 3, 2);

const io = socketIO(server);

app.get("/api/mock/:waypoint/:car", expressMock);
app.post("/api/listen", startListening);
app.post("/api/stop-listen", stopListening);
app.post("/api/start/:laps/:players", (req, res, next) => {
  startNewRace(events, req.params.laps, req.params.players);
  res.send("ok");
});

io.on("connection", socket => {
  const sub = race.subscribe(raceObj => {
    socket.emit("race", raceObj);
  });

  socket.on("disconnect", () => {
    sub.unsubscribe();
  });
});

server.listen(port, () => console.log(`Listening  on port ${port}`));
