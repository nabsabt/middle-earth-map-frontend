export interface SearchResults {
  name: {
    EN: string;
    HU: string;
  };
  gisID: number;
}

export interface GISObject {
  gisID: number;
  name: {
    EN: string;
    HU: string;
  };
  description: {
    EN: string;
    HU: string;
  };
  gallery: string[];
  area?: {
    sqKm: number;
    sqMi: number;
  };
  length?: {
    Km: number;
    Mi: number;
  };
}

export type LayerGroupKey = 'areas' | 'places' | 'paths';
export type NavbarControls =
  | 'areas'
  | 'places'
  | 'paths'
  | 'discuss'
  | 'about'
  | 'donate'
  | undefined;

export type Units = 'metric' | 'imperial';
