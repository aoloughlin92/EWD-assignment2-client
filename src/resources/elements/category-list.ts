import { bindable } from 'aurelia-framework';
import { Category } from '../../services/poi-types';

export class CategoryList {
  @bindable
  categories: Category[];
}
