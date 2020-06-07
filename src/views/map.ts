import { LeafletMap } from '../services/leaflet-map';
import { inject } from 'aurelia-framework';
import { PoiService} from "../services/poi-service";
import {POI} from "../services/poi-types";

@inject(PoiService)
export class Map {
  mapId = 'main-map';
  mapHeight = 600;
  map: LeafletMap;

  pois: POI[];


  constructor(private ps: PoiService) {
    ps.reset()
    this.pois = this.ps.pois;
  }

  renderPOIs(){
    for(let poi of this.pois){
      const poiStr= "<a href=\"#/poi/"+ poi._id+"\" >"+ poi.name+ ' - '+ poi.category.name +"</a>";
      this.map.addMarker(poi.location, poiStr, 'Points Of Interest');
    }
  }


  attached() {
    const mapConfig = {
      location: { lat: 53.2734, lng: -7.7783203, _id:""},
      zoom: 8,
      minZoom: 1
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.showZoomControl();
    this.renderPOIs();
    this.map.addLayerGroup('Points Of Interest');
    this.map.showLayerControl();

  }
}
