import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import {RawNotice} from './poi-types';
import {Category, POI, Location, User, RawPOI, Rating, Notice, Comment} from './poi-types';
import {HttpClient} from 'aurelia-http-client';
import {TotalUpdate} from "./messages";
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient,EventAggregator,Aurelia,Router)
export class PoiService{
  categories: Category[] = [];
  pois: POI[] =[];
  locations: Location[];
  notices: Notice[] =[];


  users: Map<string, User> = new Map();
  usersById: Map<string, User> = new Map();

  commentsById: Map<string, Comment> = new Map();

  constructor(private httpClient: HttpClient, private ea: EventAggregator, private au: Aurelia, private router: Router){
    httpClient.configure(http =>{
      http.withBaseUrl('http://LAPTOP-455FH4G9:3000');
    });
  }
  async getComments(){
    const response = await this.httpClient.get('/api/comments');
    const comments = await response.content;
    comments.forEach(comment => {
      const newComment = {
        commenter: this.usersById.get(comment.commenter),
        comment: comment.comment,
        _id: comment._id
      };
      this.commentsById.set(comment._id,comment);
    });
  }
  async getUsers(){
    const response = await this.httpClient.get('/api/users');
    const users = await response.content;
    users.forEach(user => {
      this.users.set(user.email, user);
      this.usersById.set(user._id, user);
    });
    console.log("Getting Users");
  }
  async getCurrentUser(){
    const response = await this.httpClient.get('/api/user');
    const user = this.usersById.get(response.content);
    return user;
  }
  async updateUser(firstName: string, lastName:string, email: string, password: string){
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
  async getCategories(){
    this.categories = [];
    const response = await this.httpClient.get('/api/categories');
    this.categories = await response.content;
    console.log("Getting Categories");
  }
  async getLocations(){
    this.locations = [];
    const response = await this.httpClient.get('/api/locations');
    this.locations = await response.content;
    console.log("Getting Locations");
  }
  async getNotices(){
    await this.getComments();
    this.notices = [];
    const response = await this.httpClient.get('/api/notices');
    const rawNotices: RawNotice[] = await response.content;
    rawNotices.forEach(rawNotice => {
      let comments: Comment[] =[];
      const rawComments: string[] = rawNotice.comments;
      rawComments.forEach(rawComment =>{
        let comment = this.commentsById.get(rawComment);
        comments.push(comment);
      });
      const notice = {
        heading: rawNotice.heading,
        body: rawNotice.body,
        user: this.usersById.get(rawNotice.user),
        _id: rawNotice._id,
        comments:comments
      };
      this.notices.push(notice);
    });
    return this.notices;
  }
  async createCategory(name: string) {
    const category = {
      name: name
    };
    const response = await this.httpClient.post('/api/categories', category);
    const newCategory = await response.content;
    this.categories.push(newCategory);
  }
  async createPoi(name: string, description:string, category: Category, location: Location, imageid: string, imageurl:string){
    const newPoi = {
      name: name,
      description: description,
      category: category,
      location: location,
      imageids: [imageid],
      imageurls: [imageurl]
    };
    const response = await this.httpClient.post('/api/categories/' + category._id + '/pois', newPoi);
    const poi ={
        name: name,
        description: description,
        category: category,
        location: location,
        imageids: [imageid],
        imageurls: [imageurl],
        creator: this.usersById.get(response.content.creator),
        ratings: []
    };
    this.pois.push(poi);
    this.ea.publish(new TotalUpdate(poi));
    //go to poi view
    this.router.navigate('viewpoi' );
  }
  async uploadImage(imagefile: any){
    const cloudinaryHttp = new HttpClient();
    cloudinaryHttp.configure(http =>{
      http.withBaseUrl("https://api.cloudinary.com/v1_1/dc1jyvek3");
    });
    const formData = new FormData();
    formData.append("file", imagefile[0]);
    formData.append("upload_preset","ol3rdu40");
    try{
      const response = await cloudinaryHttp.post("/image/upload",formData);
      return(response.content);
    }catch (err) {
      console.log(err);
    }

  }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/users', user);
    const newUser = await response.content;
    await this.getCategories();
    await this.getLocations();
    await this.getUsers();
    await this.getPOIs();
    //this.users.set(newUser.email, newUser);
    //this.usersById.set(newUser._id, newUser);
    this.changeRouter(PLATFORM.moduleName('app'));
    return false;
  }

  async login(email: string, password: string) {
    let success = false;
    try {
      const response = await this.httpClient.post('/api/users/authenticate', { email: email, password: password });
      const status = await response.content;
      if (status.success) {
        this.httpClient.configure((configuration) => {
          configuration.withHeader('Authorization', 'bearer ' + status.token);
        });
        localStorage.poi =JSON.stringify(response.content);
        await this.getCategories();
        await this.getUsers();
        await this.getLocations();
        await this.getPOIs();
        this.getNotices();
        this.changeRouter(PLATFORM.moduleName('app'));
        success = status.success;
      }
    } catch (e) {
      success = false;
    }
    return success;
  }

  logout() {
    localStorage.poi =null;
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
    this.changeRouter(PLATFORM.moduleName('start'));
  }

  changeRouter(module:string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }


  async getPOIs() {
    this.pois = [];
    const response = await this.httpClient.get('/api/pois');
    const rawPOIs: RawPOI[] = await response.content;
    rawPOIs.forEach(rawPOI => {
      const poi = {
        name: rawPOI.name,
        description : rawPOI.description,
        category: this.categories.find(category => rawPOI.category == category._id),
        creator: this.usersById.get(rawPOI.creator),
        location: this.locations.find(location => rawPOI.location == location._id),
        imageids: rawPOI.imageids,
        imageurls:rawPOI.imageurls,
        ratings: []
      };
      this.pois.push(poi);
    });
    console.log("Getting POIS");
  }
  checkIsAuthenticated() {
    let authenticated = false;
    if (localStorage.poi !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.poi);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.getLocations();
      this.getCategories();
      this.getUsers();
      this.getPOIs();
      this.getNotices();
      this.changeRouter(PLATFORM.moduleName('app'));
    }
  }
  async createNotice(heading: string, body: string){
    const newNotice ={
      heading: heading,
      body: body
    };
    const response = await this.httpClient.post('/api/notices', newNotice);
    const notice = {
      heading: heading,
      body: body,
      user: this.usersById.get(response.content.creator),
      comments: [],
      _id: response.content.id
    };
    this.notices.push(notice);
    await this.getNotices();
  }
  async createComment(comment: string, noticeId: string){
    const response = await this.httpClient.post('/api/comments', comment);
    const commentId = response.content._id;
    const newComment = {
      commentId: commentId,
      noticeId: noticeId
    };
    const responseNotice = await this.httpClient.post('/api/notices/comment', newComment);
    await this.getNotices();
    this.router.navigate('social' );
  }
}
