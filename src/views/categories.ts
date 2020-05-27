import {inject} from 'aurelia-framework';
import { Category } from '../services/poi-types';
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Categories{
  categories: Category[] =[];

  constructor(private ps: PoiService){
    this.categories = ps.categories;
  }
}
