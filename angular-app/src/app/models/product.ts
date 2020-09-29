import {Department} from './department';

export interface Product {
  name: string;
  departaments: Department[];
  stock: number;
  price: number;
  id?: string;
}
