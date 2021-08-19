import React, {useState, useEffect} from "react";
import { LatLngExpression, divIcon, MarkerCluster } from "leaflet";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import {Collapse, Row, Col} from 'antd';
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import { IState, Place } from "../../store/models";
import AddMarker from "./AddMarker";
import {fstore} from "../../firebase";

import "./Map.css";
import makeid from "../../utils";

const {Panel} = Collapse;

const generateIcon = (num : number) => {
  var numstr = ""
  numstr = num >= 1000 ? String(Math.round(num/100)/10 + "k") : String(num)
  const icon = divIcon({html: '<div class="circle"><div class="circle__inner">' + numstr + '</div></div>', className: 'empty'});
  return icon;
}

const generateClusterIcon = function (cluster: MarkerCluster) {
  const markers = cluster.getAllChildMarkers();
  let totalQuantity = 0
  markers.map(marker=>{totalQuantity += Number(marker.options.title)})
  const icon = generateIcon(totalQuantity);
  return icon;
}


const Map = ({
  isVisible,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [14.6333308, -90.5499978]; // Guatemala City position

  const [places, setPlaces] = useState([] as Place[]);

  useEffect(() => {
    (async function () {
      const snapshot = await fstore.collection("publicplaces").where("hide", "==", false).get();
      let plcs : Place[] = []
      snapshot.forEach(doc => {
        plcs.push(doc.data() as Place);
      })
      setPlaces(plcs);
    })();
}, []);

  const showPreview = (place: Place) => {
    if (isVisible) {
      togglePreview(false);
      setPlaceForPreview(null);
    }

    if (selectedPlace?.title !== place.title) {
      setTimeout(() => {
        showPlace(place);
      }, 400);
    }
  };

  const showPlace = (place: Place) => {
    setPlaceForPreview(place);
    togglePreview(true);
  };
  

  return (
    <div className="map__container">
      <MapContainer
        minZoom={3}
        center={defaultPosition}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright"/>
        <MarkerClusterGroup iconCreateFunction={generateClusterIcon} showCoverageOnHover={false}>
        {places.map((place: Place) => (
          <Marker
            icon={generateIcon(place.quantity)}
            key={place.description}
            position={place.position}
            title={String(place.quantity)}
            eventHandlers={{ click: () => showPreview(place) }}
          >
          </Marker>
        ))}
        </MarkerClusterGroup>
        <AddMarker />
      </MapContainer>
      <a href="https://www.olafilter.com">
        <img src="namedlogo.png" style={{zIndex: 1000, position:"fixed", top:10, left:10, width:100, borderRadius:10}}/>
      </a>
      {/* <img src="ola_banner2.png" style={{zIndex: 1000, position:"fixed", bottom:10, left:10, width:"40%"}}/> */}
      <Collapse
      expandIconPosition="right"
      style={{zIndex: 1000, position:"fixed", bottom:10, left:10, borderRadius:"15px"}}
    >
      <Panel
        header="Impact at a Glance"
        key="1"
      >
        <div style={{width:180}}>
          <Row className="impact-header" justify="start">Each Ola Filter</Row>
          <Row justify="start" align="middle" style={{paddingTop:10}}><img src="tap.png" style={{width:60}}/> <div style={{width:120}}>Benefits the whole family</div></Row>
          <Row justify="start" align="middle" style={{paddingTop:10}}><img src="bank.png" style={{width:60}}/> <div style={{width:120}}>Saves households hundreds of dollars</div></Row>
          <Row justify="start" align="middle" style={{paddingTop:10}}><img src="worldhands.png" style={{width:60}}/> <div style={{width:120}}>Replaces thousands of single-use plastic bottles</div></Row>
          <Row justify="start" align="middle" style={{paddingTop:10}}><img src="farmer.png" style={{width:60}}/> <div style={{width:120}}>Protects the health of families and the planet</div></Row>
        </div>
      </Panel>

    </Collapse>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { places } = state;
  return {
    isVisible: places.placePreviewsIsVisible,
    selectedPlace: places.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    togglePreview: (payload: boolean) =>
      dispatch(setPlacePreviewVisibility(payload)),
    setPlaceForPreview: (payload: Place) =>
      dispatch(setSelectedPlace(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
