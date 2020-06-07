import {inject} from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import {User} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Edituser{
  user: User;
  firstName = '';
  lastName='';
  email='';
  password = '';

  constructor(private ps: PoiService){
    ps.reset();
  }

  async activate(params){
    this.user = await this.ps.getUserById(params.id);

  }

  async editUser(){
    await this.ps.editUser(this.firstName, this.lastName, this.email, this.password,this.user._id);
  }

}
