import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormData,
    FormBuilder,
    ReactiveFormsModule
  ],
  exports: [
    FormData,
    FormBuilder,
    ReactiveFormsModule
  ]
})
export class SharedModule { 
  
}
