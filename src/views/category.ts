import {inject} from 'aurelia-framework';
import { Category, POI, Location} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Poi {
  pois: POI[];
  category: Category;



  constructor(private ps: PoiService) {
  }

  async activate(params) {
    await this.ps.reset();
    const category = await this.ps.categories.find(category => params.id == category._id);
    await this.ps.getPOIsByCategory(params.id);
    this.pois = this.ps.poisByCategory;
    this.category=category;
    return category;
  }
}
