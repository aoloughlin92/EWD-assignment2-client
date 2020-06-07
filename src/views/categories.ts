import {inject} from 'aurelia-framework';
import { Category } from '../services/poi-types';
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Categories{

  categories: Category[] =[];

  constructor(private ps: PoiService){
    setInterval(() => this.updateData(), 10_000);
    this.categories = ps.categories;
  }
  updateData(){
    this.categories = this.ps.categories;
  }
}
