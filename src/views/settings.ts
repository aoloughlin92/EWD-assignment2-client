import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import {User} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Settings{
  @bindable user: User;
  firstName = '';
  lastName='';
  email='';
  password = '';

  constructor(private ps: PoiService){
    ps.reset();
    this.userDetails();
  }

  async userDetails(){
    this.user = await this.ps.getCurrentUser();
  }

  async updateSettings(){
    await this.ps.updateUser(this.firstName, this.lastName, this.email, this.password);
  }

}
