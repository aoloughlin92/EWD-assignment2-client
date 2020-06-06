import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;


  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {
        route: ['', 'createpoi'],
        name: 'Createpoi',
        moduleId: PLATFORM.moduleName('views/createpoi'),
        nav: true,
        title: 'Create POI'
      },
      {
        route: 'viewpoi',
        name: 'viewpoi',
        moduleId: PLATFORM.moduleName('views/viewpoi'),
        nav: true,
        title: 'View POIs'
      },
      {
        route: 'poi/:id',
        name: 'POI',
        moduleId: PLATFORM.moduleName('views/poi'),
        nav: false,
        title: 'POI'
      },
      {
        route: 'editpoi/:id',
        name: 'Edit POI',
        moduleId: PLATFORM.moduleName('views/editpoi'),
        nav: false,
        title: 'Edit POI'
      },
      {
        route: 'delete/:id',
        name: 'Delete POI',
        moduleId: PLATFORM.moduleName('views/deletepoi'),
        nav: false,
        title: 'Delete POI'
      },
      {
        route: 'categories',
        name: 'categories',
        moduleId: PLATFORM.moduleName('views/categories'),
        nav: true,
        title: 'Category'
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
        route: 'settings',
        name: 'settings',
        moduleId: PLATFORM.moduleName('views/settings'),
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
