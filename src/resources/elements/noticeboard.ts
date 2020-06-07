import {bindable, inject} from 'aurelia-framework';
import {POI, Notice, Comment,User} from '../../services/poi-types';
import {PoiService} from "../../services/poi-service";


@inject(PoiService)
export class Noticeboard {
  @bindable
  pois : POI[];
  @bindable
  notices: Notice[];



  constructor(private ps: PoiService){
  }
}
