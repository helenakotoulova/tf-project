import React, { Fragment } from "react";
import Table from "./components/Table";

const App = () => {
  return (
    <Fragment>
      <h1 className="title">Our Astronauts</h1>
      <div className="underline"></div>
      <div className="containers">
        <Table />
      </div>
    </Fragment>
  );
};

export default App;
