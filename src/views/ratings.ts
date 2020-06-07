import {inject} from 'aurelia-framework';
import {Category, POI, Location, Rating, User} from "../services/poi-types";
import {PoiService} from "../services/poi-service";

@inject(PoiService)
export class Poi {
  poi: POI;
  categories: Category[];
  locations: Location[];
  ratings: Rating[];
  myMap: Map<string, User> ;
  averageRating: number;
  review: '';
  score: 0;

  constructor(private ps: PoiService) {
    this.myMap = ps.usersById;
  }



  async leaveReview(){
    this.ps.writeReview(this.review,this.score, this.poi._id);
  }

  async activate(params) {
    await this.ps.reset();
    const poi =await this.ps.getPOIById(params.id);
    const response = await this.ps.getRatingsByPOI(params.id);
    this.ratings = this.ps.ratingsByPOI;
    if(this.ratings.length>0) {
      let sumRatings = 0;
      this.ratings.forEach(rating => {
        sumRatings = sumRatings + rating.rating;
      });
      this.averageRating = Math.round(sumRatings * 10 / this.ratings.length) / 10;
    }
    else{
      this.averageRating = 0;
    }
    this.poi=poi;
    return poi
  }
}
