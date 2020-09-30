import {Component, OnDestroy, OnInit} from '@angular/core';
import {Department} from '../../models/department';
import {DepartmentService} from '../../services/department.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  depName = '';
  departments: Department[] = [];
  idToEdit: string = null;
  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.departmentService.getAll()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => {
      this.departments = res;
    }, error => console.log(error));
  }

  save(): void {
    if (this.idToEdit) {
      this.departmentService.update({_id: this.idToEdit, name: this.depName}).subscribe(() => {
        this.notify('Updated!');
        this.clearFields();
      }, error => {
        this.notify('Error!');
        console.log(error);
      });
    } else {
      this.departmentService.save({name: this.depName}).subscribe(() => {
        this.notify('Inserted!');
        this.clearFields();
      }, error => {
        this.notify('Error!');
        console.log(error);
      });
    }
  }

  cancel(): void {
    this.clearFields();
  }

  delete(dep: Department): void {
    this.departmentService.delete(dep).subscribe(
      () => {
        this.notify('Deleted!');
        this.clearFields();
      },
      error => console.log(error));
  }

  edit(dep: Department): void {
    this.depName = dep.name;
    this.idToEdit = dep._id;
  }

  notify(msg: string): void {
    this.snackBar.open(msg, 'OK', {duration: 3000});
  }

  clearFields(): void {
    this.depName = '';
    this.idToEdit = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
