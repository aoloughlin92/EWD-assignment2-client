import {inject} from 'aurelia-framework';
import { Category} from "../services/poi-types";
import {PoiService} from "../services/poi-service";



@inject(PoiService)
export class Createpoi{
  categories: Category[] = [];



  constructor(private ps: PoiService){
    ps.reset();
    this.categories = ps.categories;
  }


}
