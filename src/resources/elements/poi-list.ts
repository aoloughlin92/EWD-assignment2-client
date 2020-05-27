import { bindable } from 'aurelia-framework';
import {POI} from '../../services/poi-types';

export class PoiList {
  @bindable
  pois : POI[];
}
