import {inject} from 'aurelia-framework';
import { Category, POI, Location} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Poi {
  poi: POI;
  categories: Category[];
  locations: Location[];


  constructor(private ps: PoiService) {
  }

  async activate(params) {
    await this.ps.reset();
    const poi =await this.ps.getPOIById(params.id);
    this.poi=poi;
    return poi
  }
}
