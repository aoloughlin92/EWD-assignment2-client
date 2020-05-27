import {inject} from 'aurelia-framework';
import { Category, POI} from "../services/poi-types";
import {PoiService} from "../services/poi-service";


@inject(PoiService)
export class Createpoi{
  pois: POI[] = [];
  categories: Category[] = [];

  constructor(private ps: PoiService){
    this.categories = ps.categories;
    this.pois = ps.pois;
  }


}
