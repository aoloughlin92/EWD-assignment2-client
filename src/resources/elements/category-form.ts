import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Category } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class CategoryForm {
  name: string;
  @bindable categories: Category[];

  constructor(private ps: PoiService){}

  addCategory() {
    this.ps.createCategory(this.name);
    /*const category = {
      name: this.name,
      _id: ''
    };
    this.categories.push(category);
    console.log(category);*/
  }
}
