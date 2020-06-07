import {inject} from 'aurelia-framework';
import {POI, Category, Location, Notice} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Social{
  pois: POI[] = [];
  notices: Notice[] =[];

  constructor(private ps: PoiService){
    ps.reset();
    this.pois = ps.pois;
    this.notices = ps.notices;
  }

}
