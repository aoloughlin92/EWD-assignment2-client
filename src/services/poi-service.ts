import { inject, Aurelia } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import {Category, POI, RawPOI, User} from './poi-types';
import {HttpClient} from 'aurelia-http-client';

@inject(HttpClient,Aurelia,Router)
export class PoiService{
  categories: Category[] = [];
  pois: POI[] =[];

  users: Map<string, User> = new Map();
  usersById: Map<string, User> = new Map();

  constructor(private httpClient: HttpClient, private au: Aurelia, private router: Router){
    httpClient.configure(http =>{
      http.withBaseUrl('https://LAPTOP-455FH4G9:3000');
    });
    this.getCategories();
    this.getUsers();
    this.getPOIs();
  }

  async getUsers(){
    const response = await this.httpClient.get('/api/users');
    const users = await response.content;
    users.forEach(user => {
      this.users.set(user.email, user);
      this.usersById.set(user._id, user);
    })
  }

  async getCategories(){
    const response = await this.httpClient.get('/api/categories');
    this.categories = await response.content;
    console.log(this.categories);
  }

  async createPoi(name: string, description:string, category: Category){
    const poi = {
      name: name,
      description: description,
      category: category
    };
    const response = await this.httpClient.post('/api/categories/' + category._id + '/pois', poi);
    this.pois.push(poi);
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
    this.users.set(newUser.email, newUser);
    this.usersById.set(newUser._id, newUser);
    this.changeRouter(PLATFORM.moduleName('app'))
    return false;
  }

  async login(email: string, password: string) {
    const user = this.users.get(email);
    if (user && (user.password === password)) {
      this.changeRouter(PLATFORM.moduleName('app'))
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.changeRouter(PLATFORM.moduleName('start'))
  }

  changeRouter(module:string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }

  async getPOIs() {
    const response = await this.httpClient.get('/api/pois');
    const rawPOIs: RawPOI[] = await response.content;
    rawPOIs.forEach(rawPOI => {
      const poi = {
        name: rawPOI.name,
        description : rawPOI.description,
        category: this.categories.find(category => rawPOI.category == category._id),
        creator: this.usersById.get(rawPOI.creator)
      }
      this.pois.push(poi);
    });
  }

  async createCategory(name: string) {
    const category = {
      name: name
    };
    const response = await this.httpClient.post('/api/categories', category);
    const newCategory = await response.content;
    this.categories.push(newCategory);
  }
}
