import React from "react";
import { LatLngExpression, divIcon, MarkerCluster } from "leaflet";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import { IState, Place } from "../../store/models";
import AddMarker from "./AddMarker";

import "./Map.css";


const generateIcon = (num : number) => {
  var numstr = ""
  numstr = num > 1000 ? String(Math.round(num/100)/10 + "k") : String(num)
  const icon = divIcon({html: '<div class="circle"><span class="circle__inner">' + numstr + '</span></div>', className: 'empty'});
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
  places,
  selectedPlace,
  togglePreview,
  setPlaceForPreview,
}: any) => {
  const defaultPosition: LatLngExpression = [14.6333308, -90.5499978]; // Guatemala City position

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
      <img src="namedlogo.png" style={{zIndex: 1000, position:"fixed", top:10, left:10, width:100}}/>
      </a>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { places } = state;
  return {
    isVisible: places.placePreviewsIsVisible,
    places: places.places,
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
