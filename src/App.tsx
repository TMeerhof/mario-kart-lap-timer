import React, { Component, useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Race, RaceCar, WayPointEvent } from "../types";
import CarRow from "./components/CarRow";
import Adm from "./components/Admin";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Admin from "./components/Admin";
import Main from "./components/Main";
import "./assets/Nintend-Bold.otf";

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

  public render() {
    return (
      <div className="App">
        <Router>
          <Route path="/admin">
            {this.state.race && <Admin race={this.state.race} />}
          </Route>
          <Route path="/">
            {this.state.race && <Main race={this.state.race} />}
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
