import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {Product} from '../models/product';
import {map, tap} from 'rxjs/operators';
import {DepartmentService} from './department.service';
import {Department} from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = 'http://localhost:3000/products/';
  departments: Department[] = [];

  private productSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded = false;

  constructor(
    private http: HttpClient,
    private departmentService: DepartmentService) {
  }

  getAll(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest([this.http.get<Product[]>(this.url),
        this.departmentService.getAll]
      ).pipe(
        map(([products, departments]: any) => {
          for (const p of products) {
            const ids = p.departments as string[];
            p.departments = ids.map((id) => departments.find(dep => dep._id === id));
          }
          return products;
        })
      ).subscribe(this.productSubject$);

      this.http.get<Product[]>(this.url)
      .subscribe(this.productSubject$);
      this.loaded = true;
    }
    return this.productSubject$.asObservable();
  }

  save(prod: Product): Observable<Product> {
    const departments = (prod.departaments as Department[]).map(d => d._id);
    return this.http.post<Product>(this.url, {...prod, departments}).pipe(
      tap((res: Product) => this.productSubject$.getValue().push({...prod, _id: res._id}))
    );
  }

  delete(prod: Product): Observable<any> {
    return this.http.delete<Product>(this.url + prod._id).pipe(
      tap(() => {
        const products = this.productSubject$.getValue();
        const i = products.findIndex(p => p._id === prod._id);
        if (i >= 0) {
          products.splice(i, 1);
        }
      })
    );
  }

  update(prod: Product): Observable<Product> {
    const departments = (prod.departaments as Department[]).map(d => d._id);
    return this.http.patch<Product>(this.url + prod._id, {...prod, departments}).pipe(
      tap((res) => {
        const products = this.productSubject$.getValue();
        const i = products.findIndex(p => p._id === prod._id);
        if (i >= 0) {
          products[i] = res;
        }
      })
    );
  }
}
