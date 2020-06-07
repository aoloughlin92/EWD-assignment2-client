import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import {Admin} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Settings{
  @bindable user: Admin;
  firstName = '';
  lastName='';
  email='';
  password = '';

  constructor(private ps: PoiService){
    ps.reset();
    this.userDetails();
  }

  async userDetails(){
    this.user = await this.ps.getCurrentAdmin();
  }

  async updateSettings(){
    await this.ps.updateAdmin(this.firstName, this.lastName, this.email, this.password);
  }

}
