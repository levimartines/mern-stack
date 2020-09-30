import {Department} from './department';

export interface Product {
  name: string;
  departaments: Department[] | string[];
  stock: number;
  price: number;
  _id?: string;
}
