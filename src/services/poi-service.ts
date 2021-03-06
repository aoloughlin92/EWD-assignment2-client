import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import {RawNotice} from './poi-types';
import {Category, POI, Location, User, RawPOI, Rating, Notice, Comment,Admin} from './poi-types';
import {HttpClient} from 'aurelia-http-client';
import {TotalUpdate} from "./messages";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient,EventAggregator,Aurelia,Router)
export class PoiService {
  categories: Category[] = [];
  pois: POI[] = [];
  myPois: POI[] = [];
  userPois: POI[] = [];
  locations: Location[];
  notices: Notice[] = [];
  poisByCategory: POI[] = [];
  ratingsByPOI: Rating[] = [];
  userArray: User[] = [];

  ratingsById: Map<string, Rating> = new Map();

  users: Map<string, User> = new Map();
  usersById: Map<string, User> = new Map();

  commentsById: Map<string, Comment> = new Map();


  constructor(private httpClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router) {
    httpClient.configure(http => {
      http.withBaseUrl('https://shielded-springs-95184.herokuapp.com');//heroku
      //http.withBaseUrl('http://LAPTOP-455FH4G9:3000');
    });
  }

  // USER METHODS

  async getUsers() {
    this.userArray = [];
    const response = await this.httpClient.get('/api/users');
    const users = await response.content;
    users.forEach(user => {
      this.userArray.push(user);
      this.users.set(user.email, user);
      this.usersById.set(user._id, user);
    });
    //console.log("Getting Users");
  }

  async getCurrentUser() {
    const response = await this.httpClient.get('/api/user');
    const user = this.usersById.get(response.content);
    return user;
  }

  async getCurrentAdmin() {
    const response = await this.httpClient.get('/api/admin');
    const admin: Admin= response.content;
    return admin;
  }

  async updateUser(firstName: string, lastName: string, email: string, password: string) {
    const user = await this.getCurrentUser();
    const userId = user._id;
    const update = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/user/update', update);
  }

  async updateAdmin(firstName: string, lastName: string, email: string, password: string){
    const update = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/admin/update', update);
  }

  async editUser(firstName: string, lastName: string, email: string, password: string, userId:string) {
    const update = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/user/update', update);
  }

  async deleteUser(userId: string){
    const response = await this.httpClient.delete('/api/users/'+userId);
  }

  async getUserById(id){
    const user = this.usersById.get(id);
    return user;
  }

  // CATEGORY METHODS

  async getCategories() {
    this.categories = [];
    const response = await this.httpClient.get('/api/categories');
    this.categories = await response.content;
    //console.log("Getting Categories");
  }

  async createCategory(name: string) {
    const category = {
      name: name
    };
    const response = await this.httpClient.post('/api/categories', category);
    const newCategory = await response.content;
    this.categories.push(newCategory);
  }


  // POI METHODS

  async getPOIs() {
    this.pois = [];
    this.myPois = [];
    const response = await this.httpClient.get('/api/pois');
    const currentUser= await this.getCurrentUser();
    const rawPOIs: RawPOI[] = await response.content;
    rawPOIs.forEach(rawPOI => {
      let ratings: Rating[] = [];
      const rawRatings: string[] = rawPOI.ratings;
      rawRatings.forEach(rawRating => {
        let rating = this.ratingsById.get(rawRating);
        ratings.push(rating);
      });
      const poi = {
        name: rawPOI.name,
        description: rawPOI.description,
        category: this.categories.find(category => rawPOI.category == category._id),
        creator: this.usersById.get(rawPOI.creator),
        location: this.locations.find(location => rawPOI.location == location._id),
        imageids: rawPOI.imageids,
        imageurls: rawPOI.imageurls,
        ratings: ratings,
        _id: rawPOI._id
      };
      if(currentUser) {
        if (rawPOI.creator == currentUser._id) {
          this.myPois.push(poi);
        }
      }
      this.pois.push(poi);
    });
    //console.log("Getting POIS");
  }

  async getPOIsByCreator(userId: string){
    this.userPois =[];
    const response = await this.httpClient.get('/api/users/'+userId+'/pois');
    const user = await this.getUserById(userId);
    const rawPOIs: RawPOI[] = await response.content;
    rawPOIs.forEach(rawPOI => {
      let ratings: Rating[] = [];
      const rawRatings: string[] = rawPOI.ratings;
      rawRatings.forEach(rawRating => {
        let rating = this.ratingsById.get(rawRating);
        ratings.push(rating);
      });
      const poi = {
        name: rawPOI.name,
        description: rawPOI.description,
        category: this.categories.find(category => rawPOI.category == category._id),
        creator: user,
        location: this.locations.find(location => rawPOI.location == location._id),
        imageids: rawPOI.imageids,
        imageurls: rawPOI.imageurls,
        ratings: ratings,
        _id: rawPOI._id
      };
      this.userPois.push(poi);
    });
  }

  async createPoi(name: string, description: string, category: Category, location: Location, imageid: string, imageurl: string) {
    const newPoi = {
      name: name,
      description: description,
      category: category,
      location: location,
      imageids: [imageid],
      imageurls: [imageurl]
    };
    const response = await this.httpClient.post('/api/categories/' + category._id + '/pois', newPoi);
    const poi = {
      name: name,
      description: description,
      category: category,
      location: location,
      imageids: [imageid],
      imageurls: [imageurl],
      creator: this.usersById.get(response.content.creator),
      ratings: [],
      _id: response.content._id
    };
    this.pois.push(poi);
    this.ea.publish(new TotalUpdate(poi));
    //go to poi view
    this.router.navigate('viewpoi');
  }

  async editPOI(id: string, name: string, description: string, category: Category, location: Location){
    const poiEdit ={
      id: id,
      name: name,
      description: description,
      category: category,
      location: location,
    };
    const response = await this.httpClient.post('/api/pois/'+id, poiEdit);
    console.log(response.content);

  }

  async deletePOI(id: string){
    const response = await this.httpClient.delete('/api/pois/'+id);
    console.log(response);
    await this.reset();
    this.router.navigate('viewpoi');
    return response;
  }

  async addImage(id: string, imageid: string, imageurl: string){
    const imageDetails={
      imageid: imageid,
      imageurl: imageurl
    };
    const response = await this.httpClient.post('/api/pois/'+id +'/addimage', imageDetails);
    console.log(response.content);
  }

  async uploadImage(imagefile: any) {
    const cloudinaryHttp = new HttpClient();
    cloudinaryHttp.configure(http => {
      http.withBaseUrl("https://api.cloudinary.com/v1_1/dc1jyvek3");
    });
    const formData = new FormData();
    formData.append("file", imagefile[0]);
    formData.append("upload_preset", "ol3rdu40");
    try {
      const response = await cloudinaryHttp.post("/image/upload", formData);
      return (response.content);
    } catch (err) {
      console.log(err);
    }

  }

  async deleteImage(index:number, poiId: string){
    const data = {
      index: index,
    };
    const response = await this.httpClient.post('/api/pois/'+poiId + '/deleteimage', data);
  }

  async getPOIById(id: string) {
    /*const poi = this.pois.find(poi => id == poi._id);
    console.log(poi);
    return poi;*/
    const response = await this.httpClient.get('/api/pois/'+id);
    const poi = {
      name: response.content.name,
      description: response.content.description,
      category: this.categories.find(category => response.content.category == category._id),
      creator: this.usersById.get(response.content.creator),
      location: this.locations.find( location => response.content.location == location._id),
      imageids: response.content.imageids,
      imageurls: response.content.imageurls,
      ratings: [],
      _id: response.content._id
    };
    return poi;

  }

  async getPOIsByCategory(id: string){
    this.poisByCategory = [];
    const response = await this.httpClient.get('/api/categories/'+id+'/pois');
    const rawPOIs: RawPOI[] = await response.content;
    rawPOIs.forEach(rawPOI => {
      const poi = {
        name: rawPOI.name,
        description: rawPOI.description,
        category: this.categories.find(category => rawPOI.category == category._id),
        creator: this.usersById.get(rawPOI.creator),
        location: this.locations.find(location => rawPOI.location == location._id),
        imageids: rawPOI.imageids,
        imageurls: rawPOI.imageurls,
        ratings: [],
        _id: rawPOI._id
      };
      this.poisByCategory.push(poi);
    });
  }

  async getRatingsByPOI(id: string){
    this.ratingsByPOI = [];
    const response = await this.httpClient.get('/api/pois/'+id+'/ratings');
    this.ratingsByPOI= response.content;
  }

  async getRatings(){
    const response = await this.httpClient.get('/api/ratings');
    const ratings = await response.content;
    ratings.forEach(rating =>{
      const newRating = {
        rating: rating.rating,
        review: rating.review,
        reviewer: this.usersById.get(rating.reviewer),
        _id: rating._id
      };
      this.ratingsById.set(rating._id, newRating)
    });
  }

  async writeReview(review: string, rating: number, poiId: string) {
    const data={
      review: review,
      rating: rating
    };
    const response = await this.httpClient.post('/api/ratings',data);
    const ratingId = response.content._id;
    const newRating = {
      ratingId: ratingId,
      poiId: poiId
    };
    const responsePoi = await this.httpClient.post('/api/pois/ratings', newRating);
    await this.reset();
  }


  async getLocations() {
    this.locations = [];
    const response = await this.httpClient.get('/api/locations');
    this.locations = response.content;
    //console.log("Getting Locations");
  }

  //Signup,  Login, Logout, Authenticate and Router

  async signup(firstName: string, lastName: string, email: string, password: string) {
    let success = false;
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/users', user);

    const newUser = await response.content.user;
    const status = await response.content;
    if (newUser) {
      this.httpClient.configure((configuration) => {
        configuration.withHeader('Authorization', 'bearer ' + status.token);
      });
      localStorage.poi = JSON.stringify(response.content);
      await this.reset();
      this.changeRouter(PLATFORM.moduleName('app'));
      success = status.success;
      return success;
    }
  }

  async login(email: string, password: string) {
    let success = false;
    let admin = null;
    try {
        const response = await this.httpClient.post('/api/users/authenticate', {email: email, password: password});
        const status = await response.content;
        if (status.success) {
          this.httpClient.configure((configuration) => {
            configuration.withHeader('Authorization', 'bearer ' + status.token);
          });
          localStorage.poi = JSON.stringify(response.content);
          await this.reset();
          this.changeRouter(PLATFORM.moduleName('app'));
          success = status.success;
          return success;
        }
    }
    catch{
      try {
        const response = await this.httpClient.post('/api/admins/authenticate', {email: email, password: password});
        const status = await response.content;
        if (status.success) {
          this.httpClient.configure((configuration) => {
            configuration.withHeader('Authorization', 'bearer ' + status.token);
          });
          localStorage.poiadmin = JSON.stringify(response.content);
          await this.reset();
          this.changeRouter(PLATFORM.moduleName('admin'));
          success = status.success;
          return success;
        }
      }
      catch (e) {
        success = false;
        return success;
      }
    }
  }

  logout() {
    localStorage.poi = null;
    localStorage.poiadmin = null;
    this.myPois =[];
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
    this.changeRouter(PLATFORM.moduleName('start'));
  }

  changeRouter(module: string) {
    this.router.navigate('/', {replace: true, trigger: false});
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }

  checkIsAuthenticated() {
    let authenticated = false;
    if (localStorage.poi !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.poi);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.reset();
      this.changeRouter(PLATFORM.moduleName('app'));
    }
    if (localStorage.poiadmin !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.poiadmin);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.reset();
      this.changeRouter(PLATFORM.moduleName('admin'));
    }
  }

  async reset(){
    console.log("Running update");
    await this.getCategories();
    await this.getUsers();
    await this.getLocations();
    await this.getRatings();
    await this.getPOIs();
    await this.getNotices();
  }

  //Notices and Comments

  async getComments() {
    const response = await this.httpClient.get('/api/comments');
    const comments = await response.content;
    comments.forEach(comment => {
      const newComment = {
        commenter: this.usersById.get(comment.commenter),
        comment: comment.comment,
        _id: comment._id
      };
      this.commentsById.set(comment._id, comment);
    });
  }

  async getNotices() {
    await this.getComments();
    this.notices = [];
    const response = await this.httpClient.get('/api/notices');
    const rawNotices: RawNotice[] = await response.content;
    rawNotices.forEach(rawNotice => {
      let comments: Comment[] = [];
      const rawComments: string[] = rawNotice.comments;
      rawComments.forEach(rawComment => {
        let comment = this.commentsById.get(rawComment);
        comments.push(comment);
      });
      const notice = {
        heading: rawNotice.heading,
        body: rawNotice.body,
        user: this.usersById.get(rawNotice.user),
        _id: rawNotice._id,
        comments: comments
      };

      this.notices.push(notice);
    });
    return this.notices;
  }

  async createNotice(heading: string, body: string) {
    const newNotice = {
      heading: heading,
      body: body
    };
    const response = await this.httpClient.post('/api/notices', newNotice);
    const notice = {
      heading: heading,
      body: body,
      user: this.usersById.get(response.content.user),
      comments: [],
      _id: response.content.id
    };
    this.notices.push(notice);
    await this.reset();
  }

  async createComment(comment: string, noticeId: string) {
    if(comment.length==0){
      return null;
    }
    const response = await this.httpClient.post('/api/comments', comment);
    const commentId = response.content._id;
    const newComment = {
      commentId: commentId,
      noticeId: noticeId
    };
    const responseNotice = await this.httpClient.post('/api/notices/comment', newComment);
    await this.reset();
  }





}




