import React from "react";
import Map from "./Map/Map";
import Preview from "./Preview/Preview";
import Form from "./Form/Form";


function PublicPage() {
  return (
    <>
        <div style={{display:'flex', position:'fixed'}}>
          <Map />
          <Preview />
          <Form />
        </div>
    </>
  );
}

export default PublicPage;