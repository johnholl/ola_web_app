import { LatLngExpression } from "leaflet";

export interface SearchState {
  searchIsVisible: boolean;
}

export interface PlaceState {
  places: Place[];
  selectedPlace: Place | null;
  placePreviewsIsVisible: boolean;
  placeFormIsVisible: boolean;
  prePlacePosition: LatLngExpression;
}

export interface IState {
  search: SearchState;
  places: PlaceState;
}

export interface Place {
  key: string;
  photoUrl: string;
  photoName: string;
  title: string;
  description: string;
  seeMoreLink: string;
  position: LatLngExpression;
  quantity: number;
  partnerName: string;
  partnerType: string;
  id: string;
  hide: boolean;
}
