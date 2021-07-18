 
import React from "react";
import "./App.css";
import Map from "./components/Map/Map";
import Search from "./components/Search/Search";
import Preview from "./components/Preview/Preview";
import Form from "./components/Form/Form";


function App() {
  return (
    <>
        <div style={{display:'flex', position:'fixed'}}>
          <Search /> 
          <Map />
          <Preview />
          <Form />
        </div>
    </>
  );
}

export default App;