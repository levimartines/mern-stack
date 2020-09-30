import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../models/product';
import {DepartmentService} from '../../services/department.service';
import {Department} from '../../models/department';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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

  constructor(
    private productService: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder) {
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
    console.log('Save');
  }
}
