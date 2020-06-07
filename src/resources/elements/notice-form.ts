import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';
import { Notice } from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class NoticeForm {
  heading: string;
  body: string
  @bindable
  notices: Notice[];

  constructor(private ps: PoiService){}

  addNotice() {
    this.ps.createNotice(this.heading, this.body);
    this.heading="";
    this.body ="";
  }
}
