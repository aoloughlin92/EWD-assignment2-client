import {inject} from 'aurelia-framework';
import { Category, POI, Location, User} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Viewusers{
  users: User[]= [];


  constructor(private ps: PoiService){
    setInterval(() => this.updateData(), 20_000);
    this.users=ps.userArray;
  }

  updateData(){
    this.ps.reset();
    this.users = this.ps.userArray;
  }

  async deleteUser(params){
    await this.ps.deleteUser(params);
  }
}
