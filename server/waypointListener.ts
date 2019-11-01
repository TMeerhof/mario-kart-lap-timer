import {
  Subject,
  Observable,
  Observer,
  timer,
  pipe,
  zip,
  range,
  Subscription
} from "rxjs";
import { Request, Response, NextFunction } from "express";
import { WayPointEvent } from "../types";
import net from "net";
import {
  combineAll,
  retry,
  retryWhen,
  map,
  mergeMap,
  tap
} from "rxjs/operators";

export const events = new Subject<WayPointEvent>();

export function expressMock(req: Request, res: Response, next: NextFunction) {
  console.log(req.params);
  res.send(`ok, waypoint: ${req.params.waypoint}, car: ${req.params.car}`);
  events.next({
    waypoint: parseInt(req.params.waypoint),
    car: parseInt(req.params.car),
    ts: Date.now()
  });
}

let subs: Subscription[] = [];

// const waypoints = ["waypoint1.local", "waypoint2.local", "waypoint3.local"];
const waypoints = ["waypoint1.local"];
export function startListening(
  req: Request,
  res: Response,
  next: NextFunction
) {
  subs = waypoints.map((host, i) => {
    return observeWaypoint(host, i + 1)
      .pipe(backoff(500, 500))
      .subscribe(events);
  });

  res.send("ok");
}

function backoff(maxTries, ms) {
  return pipe(
    retryWhen(attempts =>
      zip(range(1, maxTries), attempts).pipe(
        tap(() => console.log("retrying")),
        map(([i]) => i * i),
        mergeMap(i => timer(i * ms))
      )
    )
  );
}

export function stopListening(req: Request, res: Response, next: NextFunction) {
  if (subs.length) {
    subs.forEach(s => {
      s.unsubscribe();
    });
    subs = [];
  }
  res.send("ok");
}

function rand(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function mockRX(host: string, number: number) {
  return Observable.create((observer: Observer<WayPointEvent>) => {
    const sub = timer(0, Math.random() * 1000).subscribe(() => {
      observer.next({
        waypoint: number,
        car: rand([26, 27, 1, 34]),
        ts: Date.now()
      });
    });
    return () => {
      sub.unsubscribe();
    };
  });
}

export function observeWaypoint(
  host: string,
  number: number
): Observable<WayPointEvent> {
  return Observable.create((observer: Observer<WayPointEvent>) => {
    const client = net.createConnection({
      port: 3007,
      host: host
    });

    client.on("connect", () => {
      console.log("connected");
    });

    client.on("data", function(data) {
      const msg = data.toString().split(" ");
      console.log("Received: " + data);
      observer.next({
        waypoint: number,
        car: parseInt(msg[1]),
        ts: Date.now()
      });
    });

    client.on("error", e => {
      console.error(e);
      observer.error(e);
    });

    client.on("close", function() {
      console.log("Connection closed", arguments);
      // client.destroy();
      observer.error(new Error("unexpected close"));
    });
    return () => {
      console.log("disconnecting");
      client.destroy();
    };
  });
}
