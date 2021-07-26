import React, {useContext} from "react";
import Map from "./AdminMap/Map";
import Preview from "./AdminPreview/Preview";
import Form from "./AdminForm/Form";
import {UserContext} from "../providers/UserProvider"


function AdminPage(props: any) {

  const user = useContext(UserContext);

  if(!user){
      props.history.push('/Login');
  }

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

export default AdminPage;