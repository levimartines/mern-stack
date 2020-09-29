import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from './app-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ProductsComponent} from './pages/products/products.component';
import {DepartmentsComponent} from './pages/departments/departments.component';
import {ProductService} from './services/product.service';
import {DepartmentService} from './services/department.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    DepartmentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    DepartmentService,
    ProductService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
