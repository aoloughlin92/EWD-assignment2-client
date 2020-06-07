import {bindable, inject} from 'aurelia-framework';
import { Category, POI, Location} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Editpoi {
  poi: POI;
  categories: Category[];
  location: Location;
  name = '';
  description='';
  selectedCategory: Category = null;

  @bindable
  imagefile= null;

  constructor(private ps: PoiService) {
    this.categories=ps.categories;
  }

  async saveChanges(){
    console.log("POI Id: "+ this.poi._id);
    console.log("POI name: "+ this.name);
    console.log("POI description: "+ this.description);
    console.log("poi Category: " + this.selectedCategory);
    console.log("poi locations: "+ this.location);
    await this.ps.editPOI(this.poi._id,this.name, this.description, this.selectedCategory, this.location );
  }

  async uploadImage(){
   var imageid = "";
    var imageurl = "";
    if(this.imagefile!=null) {
      const response = await this.ps.uploadImage(this.imagefile);
      imageid = response.public_id;
      imageurl = response.url;
      await this.ps.addImage(this.poi._id, imageid, imageurl);
    }
  }

  async deleteImage(params){
    const index = params;
    console.log(params);
    const poiId=this.poi._id;
    await this.ps.deleteImage(index, poiId);
  }

  async activate(params) {
    await this.ps.getPOIs();
    const poi =await this.ps.getPOIById(params.id);
    this.poi=poi;
    this.location= this.poi.location;
    this.selectedCategory = poi.category;
    return poi;
  }
}
