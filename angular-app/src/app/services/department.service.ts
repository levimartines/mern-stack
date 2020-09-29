import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Department} from '../models/department';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly url = 'http://localhost:3000/departments/';

  private departmentSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded = false;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.url)
      .pipe(tap((res) => console.log(res)))
      .subscribe(this.departmentSubject$);
      this.loaded = true;
    }
    return this.departmentSubject$.asObservable();
  }

  save(dep: Department): Observable<Department> {
    return this.http.post<Department>(this.url, dep).pipe(
      tap((res: Department) => this.departmentSubject$.getValue().push(res))
    );
  }

  delete(dep: Department): Observable<any> {
    return this.http.delete<Department>(this.url + dep._id).pipe(
      tap(() => {
        const departments = this.departmentSubject$.getValue();
        const i = departments.findIndex(d => d._id === dep._id);
        if (i >= 0) {
          departments.splice(i, 1);
        }
      })
    );
  }

  update(dep: Department): Observable<Department> {
    return this.http.patch<Department>(this.url + dep._id, dep).pipe(
      tap((res) => {
        const departments = this.departmentSubject$.getValue();
        const i = departments.findIndex(d => d._id === dep._id);
        if (i >= 0) {
          departments[i].name = res.name;
        }
      })
    );
  }
}
