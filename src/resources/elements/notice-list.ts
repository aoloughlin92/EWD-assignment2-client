import {bindable, inject} from 'aurelia-framework';
import { Notice ,Comment, User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";

@inject(PoiService)
export class NoticeList {
  @bindable
  notices: Notice[];
  @bindable
  noticeId: '';
  @bindable
  comment;
  myMap: Map<string, User> ;

  constructor(private ps: PoiService){
    this.myMap = ps.usersById;
  }


  addComment(params) {
    this.ps.createComment(this.comment,params);
    this.comment="";
  }
}
