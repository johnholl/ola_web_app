import React, {useState, useEffect} from "react";
import { LatLngExpression, divIcon, MarkerCluster } from "leaflet";
import { Input, Button, InputNumber, Row, DatePicker, Collapse } from "antd";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { connect } from "react-redux";
import { setPlacePreviewVisibility, setSelectedPlace } from "../../store/actions";
import { IState, Place } from "../../store/models";
import AddMarker from "./AddMarker";
import {fstore} from "../../firebase";
import { uuid } from 'uuidv4';
import { Moment } from 'moment'
import { EventValue } from 'rc-picker/lib/interface'
import "./Map.css";
let moment = require('moment');

const { RangePicker } = DatePicker;
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
  const [filteredPlaces, setFilteredPlaces] = useState([] as Place[]);
  const [filters, setFilters] = useState(0);
  const [partners, setPartners] = useState(0);

  const [minQFilt, setMinQFilt] = useState(0);
  const [maxQFilt, setMaxQFilt] = useState(1000000);
  const [partnerFilt, setPartnerFilt] = useState("");
  const initTimes: [Moment, Moment] = [moment('07/01/2021', 'MM/DD/YYYY'), moment()]
  const [timeRange, setTimeRange] = useState(initTimes)




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


  const filter = () => {
    console.log("filtering");
    console.log(partnerFilt);
    console.log(minQFilt);
    console.log(maxQFilt);
    const fp = places.filter(place=>place.quantity <= maxQFilt &&
                             place.quantity >= minQFilt && 
                             place.partnerName?.toUpperCase().includes(partnerFilt?.toUpperCase()) &&
                             ((place.dt > timeRange[0].valueOf() && place.dt < timeRange[1].valueOf()) || !place.dt));
    console.log(fp);
    setFilteredPlaces(fp);
  }

  const resetFields = () => {
    setMaxQFilt(1000000);
    setMinQFilt(0);
    setPartnerFilt("");
    console.log(places);
    setFilteredPlaces(places);
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
        <MarkerClusterGroup iconCreateFunction={generateClusterIcon} key={uuid()}>
        {filteredPlaces.map((place: Place) => {
          return(
          <Marker
            icon={generateIcon(place.quantity)}
            key={place.id}
            position={place.position}
            title={String(place.quantity)}
            eventHandlers={{ click: () => showPreview(place) }}
          >
          </Marker>
        )})}
        </MarkerClusterGroup>
        <AddMarker />
      </MapContainer>
      <a href="https://www.olafilter.com">
      <img src="namedlogo.png" style={{zIndex: 1000, position:"fixed", top:10, left:10, width:100, borderRadius:10}}/>
      </a>
      <Collapse>
        <Panel style={{zIndex: 1000, position:"fixed", top:10, right:10, borderRadius:5, backgroundColor:"white", padding:10, font:"bold 12px Helvetica, Verdana, Tahoma", width:160, height:80}}
        header="Search" key={1}>
          <Row align="middle"><div style={{width:60}}>Partner: </div><Input style={{width:100}} value={partnerFilt} onChange={(e)=>setPartnerFilt(e.target.value)}/></Row>
          <Row style={{paddingTop:5}}><div style={{width:60}}>Min: </div><InputNumber style={{width:100}} placeholder="Min Quantity" value={minQFilt} onChange={(val)=>{const fixval = val ? parseInt(val.toString()) : 0;setMinQFilt(fixval)}}/></Row>
          <Row style={{paddingTop:5}}><div style={{width:60}}>Max: </div><InputNumber style={{width:100}} placeholder="Max Quantity" value={maxQFilt} onChange={(val)=>{const fixval = val ? parseInt(val.toString()) : 0;setMaxQFilt(fixval)}}/></Row>
          <Row style={{paddingTop:5}}><div style={{width:60}}>Date: </div><RangePicker value={timeRange} onChange={(v) => {console.log(v);setTimeRange(v as [Moment, Moment])}}/></Row>
          <Button type="primary" onClick={filter} style={{paddingTop:5}}>Filter</Button>
          <Button type="ghost" onClick={resetFields} style={{paddingTop:5}}>Reset</Button>
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
