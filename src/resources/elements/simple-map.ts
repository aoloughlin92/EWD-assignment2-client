import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeafletMap } from '../../services/leaflet-map';
import {TotalUpdate} from "../../services/messages";
import {POI} from "../../services/poi-types";
import {PoiService} from "../../services/poi-service";

@inject(EventAggregator, PoiService)
export class SimpleMap {
  mapId = 'simple-map';
  mapHeight = 300;
  map: LeafletMap;


  constructor(private ea: EventAggregator, private ps: PoiService) {
    ea.subscribe(TotalUpdate, (msg) =>{
      this.renderPOI(msg.poi);
    });

  }

  renderPOI(poi: POI){
    if(this.map){
      this.map.addMarker(poi.location);
      this.map.moveTo(12,poi.location);
    }
  }


  attached() {
    const mapConfig = {
      location: { lat: 53.2734, lng: -7.7783203, _id: "" },
      zoom: 8,
      minZoom: 7,
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.showZoomControl();
  }
}
