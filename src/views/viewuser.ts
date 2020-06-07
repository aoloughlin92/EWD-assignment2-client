import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import {User, POI} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Viewuser{
  @bindable
  user: User;
  pois: POI[] =[];

  constructor(private ps: PoiService){
    ps.reset();
    this.pois = ps.userPois;

  }

  async activate(params){
    this.user = await this.ps.getUserById(params.id);
    await this.ps.getPOIsByCreator(params.id);
    this.pois = this.ps.userPois;
  }

  async deletePOI(params){
    await this.ps.deletePOI(params);
  }

}
