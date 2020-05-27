import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Category, POI } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class PoiForm {
  name = '';
  description='';

 // @bindable
 // pois: POI[] = [];

  @bindable
  categories: Category[] =[];
  selectedCategory: Category = null;

  constructor (private ps: PoiService){}
  uploadPOI(){
    this.ps.createPoi(this.name,this.description, this.selectedCategory);
  }


  /*uploadPOI(){
    const poi ={
      name: this.name,
      description: this.description,
      category: this.selectedCategory
    }
    this.pois.push(poi);
    console.log(this.pois);
  }*/
}
