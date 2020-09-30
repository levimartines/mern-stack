import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Product} from '../../models/product';
import {DepartmentService} from '../../services/department.service';
import {Department} from '../../models/department';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  products: Product[];
  departments: Department[];
  private unsubscribe$: Subject<any> = new Subject<any>();
  @ViewChild('formElement') formElement: NgForm;

  constructor(
    private productService: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.productForm = this.fb.group({
      _id: [null],
      name: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      departments: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.productService.getAll().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.products = res;
    }, error => console.log(error));
    this.departmentService.getAll().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.departments = res;
    }, error => console.log(error));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  save(): void {
    const data = this.productForm.value;
    if (data._id != null) {
      this.productService.update(data).subscribe(() => {
        this.notify('Updated!');
      });
    } else {
      this.productService.save(data).subscribe(res => {
        this.notify('Inserted!');
      });
    }
    this.resetForm();
  }

  resetForm(): void {
    console.log(this.formElement);
    this.formElement.resetForm();
  }

  notify(msg: string): void {
    this.snackBar.open(msg, 'OK', {duration: 3000});
  }

  delete(prod: Product): void {
    this.productService.delete(prod).subscribe(
      () => {
        this.notify('Deleted!');
      },
      error => console.log(error));
  }

  edit(prod: Product): void {
    this.productForm.setValue(prod);
  }
}
