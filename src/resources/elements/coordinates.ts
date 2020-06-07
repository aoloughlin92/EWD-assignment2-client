import { bindable } from 'aurelia-framework';
import { Location } from '../../services/poi-types';

export class Coordinates {
  @bindable location: Location;
}
