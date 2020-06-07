import {inject} from 'aurelia-framework';
import { Category, POI, Location} from "../services/poi-types";
import {PoiService} from "../services/poi-service";



@inject(PoiService)
export class Viewpoi{
  pois: POI[] = [];
  categories: Category[] = [];
  locations: Location[]=[];


  constructor(private ps: PoiService){
    ps.reset();
    this.categories = ps.categories;
    this.pois = ps.myPois;
    this.locations= ps.locations;
  }


}
