export interface Category{
  name: string;
  _id: string;
}

export interface POI{
  name: string;
  description: string;
  category: Category;
}
export interface User{
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
}
