export interface Category{
  name: string;
  _id: string;
}
export interface POI{
  name: string;
  description: string;
  category: Category;
  location: Location;
  imageids: string[];
  imageurls: string[];
  creator: User;
  ratings: Rating[];
  _id: string;
}
export interface User{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id: string;
}
export interface Admin{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id: string;
}
export interface RawPOI{
  name: string;
  description: string;
  category: string;
  creator: string;
  location: string;
  imageids: string[];
  imageurls: string[];
  ratings: string[];
  _id: string;
}
export interface Location{
  lat: number;
  lng: number;
  _id: string;
}
export interface Rating{
  rating: number;
  review: string;
  reviewer: User;
  _id: string;
}
export interface Notice{
  user: User;
  heading: string;
  body: string;
  comments: Comment[];
  _id: string;
}
export interface Comment{
  commenter: User;
  comment: string;
  _id: string;
}
export interface RawNotice{
  heading: string;
  body: string;
  user: string;
  comments: string[];
  _id:string;
}



