import React from "react";
import Map from "./Map/Map";
import Search from "./Search/Search";
import Preview from "./Preview/Preview";
import Form from "./Form/Form";


function PublicPage() {
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

export default PublicPage;