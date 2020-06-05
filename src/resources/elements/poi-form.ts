import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Category, Location } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class PoiForm {
  name = '';
  description='';
  @bindable
  categories: Category[] =[];
  selectedCategory: Category = null;

  @bindable
  imagefile= null;
  location: Location = null;

  constructor (private ps: PoiService){
    this.importCategories();
  }
  async importCategories(){
    const response = await this.ps.getCategories();
    this.categories = this.ps.categories;
  }
  async uploadPOI(){
    var imageid = "";
    var imageurl = "";
    if(this.imagefile) {
      const response = await this.ps.uploadImage(this.imagefile);
      imageid = response.public_id;
      imageurl = response.url;
    }
    await this.ps.createPoi(this.name,this.description, this.selectedCategory, this.location, imageid, imageurl);
  }
}
