import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;


  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {
        route: ['', 'viewusers'],
        name: 'Viewusers',
        moduleId: PLATFORM.moduleName('views/viewusers'),
        nav: true,
        title: 'View Users'
      },
      {
        route: 'poi/:id',
        name: 'POI',
        moduleId: PLATFORM.moduleName('views/poi'),
        nav: false,
        title: 'POI'
      },
      {
        route: 'category/:id',
        name: 'Category',
        moduleId: PLATFORM.moduleName('views/category'),
        nav: false,
        title: 'Category'
      },
      {
        route: 'user/:id',
        name: 'user',
        moduleId: PLATFORM.moduleName('views/viewuser'),
        nav: false,
        title: 'User'
      },
      {
        route: 'ratings/:id',
        name: 'Ratings',
        moduleId: PLATFORM.moduleName('views/ratings'),
        nav: false,
        title: 'Ratings'
      },
      {
        route: 'edituser/:id',
        name: 'Edituser',
        moduleId: PLATFORM.moduleName('views/edituser'),
        nav: false,
        title: 'Edit User'
      },
      {
        route: 'categories',
        name: 'categories',
        moduleId: PLATFORM.moduleName('views/categories'),
        nav: true,
        title: 'Categories'
      },
      {
        route: 'map',
        name: 'map',
        moduleId: PLATFORM.moduleName('views/map'),
        nav: true,
        title: 'Map'
      },
      {
        route: 'social',
        name: 'social',
        moduleId: PLATFORM.moduleName('views/social'),
        nav: true,
        title: 'Social'
      },
      {
        route: 'adminsettings',
        name: 'adminsettings',
        moduleId: PLATFORM.moduleName('views/adminsettings'),
        nav: true,
        title: 'Settings'
      },
      {
        route: 'logout',
        name: 'logout',
        moduleId: PLATFORM.moduleName('views/logout'),
        nav: true,
        title: 'Logout'
      }
    ]);
    this.router = router;
  }
}
