import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ValidationErrorService } from '../../services/validation-error.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-ranch-management',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './ranch-management.component.html',
  styleUrl: './ranch-management.component.css'
})
export class RanchManagementComponent {

  Form!: FormGroup;
  data: any;
  p: any = 1;
  isLoading: boolean = false;
  searchText: string = '';
  filteredData: any[] = [];
  @ViewChild('closeModal') closeModal!: ElementRef;
  ranchId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;


  constructor(private commonService: CommonService, private toastr: NzMessageService, private fb: FormBuilder,
    public validationErrorService: ValidationErrorService) { }

  ngOnInit() {
    this.getDetails();
    this.initForm();
  }

  initForm() {
    this.Form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-amenties').subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.data = resp.data.reverse();
        this.filterTable();
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.data;
    // Filter by customer name
    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: any) =>
        (item.title?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  getPostId(id: any) {
    this.ranchId = id;
  }

  deleteRanch() {
    this.isLoading = true;
    this.commonService
      .delete(`admin/delete-reel/${this.ranchId}`)
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalDelete.nativeElement.click();
            this.getDetails();
          } else {
            this.isLoading = false;
            this.toastr.warning(resp.message);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.toastr.warning(error || 'Something went wrong!');
        }
      })
  }


}
