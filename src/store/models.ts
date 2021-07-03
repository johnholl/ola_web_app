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
  picture: string;
  title: string;
  description: string;
  seeMoreLink: string;
  position: LatLngExpression;
  quantity: number;
}
