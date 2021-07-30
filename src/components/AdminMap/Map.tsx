import React, {useState, useEffect} from "react";
import { LatLngExpression, divIcon, MarkerCluster } from "leaflet";
import { Row, Col } from "antd";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import { IState, Place } from "../../store/models";
import AddMarker from "./AddMarker";
import {fstore} from "../../firebase";

import "./Map.css";


const generateIcon = (num : number) => {
  var numstr = ""
  numstr = num >= 1000 ? String(Math.round(num/100)/10 + "k") : String(num)
  const icon = divIcon({html: '<div class="circle">' + numstr + '</div>', className: 'empty'});
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
  const [filteredPlaces, setFilteredPlaces] = useState([] as Place[]);
  const [filters, setFilters] = useState(0);
  const [partners, setPartners] = useState(0);


  useEffect(() => {
    (async function () {
      const snapshot = await fstore.collection("publicplaces").get();
      let plcs : Place[] = []
      let totfilt = 0;
      let totpartners = 0;
      let partners : any[] = []
      snapshot.forEach(doc => {
        plcs.push({...doc.data(), id: doc.id} as Place);
        totfilt += parseInt(doc.data().quantity);
        console.log(doc.data().quantity);
        if(!partners.includes(doc.data().partnerName)){
          partners.push(doc.data().partnerName);
          totpartners += 1;
        }
      })
      setPlaces(plcs);
      setFilteredPlaces(plcs);
      setFilters(totfilt);
      setPartners(totpartners);
    })();
}, []);


  const filterByPartner = (value: string) => {
    const fp = places.filter(place => place.partnerName == value);
    setFilteredPlaces(fp);
  }

  const filterByPartnerType = (value: string) => {
    const fp = places.filter(place => place.partnerType == value);
    setFilteredPlaces(fp);
  }

  const filterByQuantity = (value: number) => {
    const fp = places.filter(place => place.quantity >= value);
    setFilteredPlaces(fp);
  }

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
        <MarkerClusterGroup iconCreateFunction={generateClusterIcon}>
        {places.map((place: Place) => (
          <Marker
            icon={generateIcon(place.quantity)}
            key={place.quantity}
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
      <div style={{zIndex: 1000, position:"fixed", bottom:20, left:20, width:200,
       height:100, borderRadius:5, backgroundColor:"white",
       boxShadow:"5px 5px 5px", border:"1px solid #000"}}>
          <Row justify="center" style={{fontSize:14, fontWeight:900}}>Totals</Row>
          <Row justify="start" style={{fontSize:12, fontWeight:700, paddingLeft:20}}>{partners + " partners"}</Row>
          <Row justify="start" style={{fontSize:12, fontWeight:700, paddingLeft:20}}>{filters + " filters distributed"}</Row>
      </div>
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
