import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { ValidationErrorService } from '../../services/validation-error.service';

@Component({
  selector: 'app-category-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent {

  Form!: FormGroup;
  data: any;
  p: any = 1;
  isLoading: boolean = false;
  searchText: string = '';
  filteredData: any[] = [];
  profile_image: any = ''; // Will be used for preview
  selectedLogoFile: File | null = null; // For uploading in FormData
  isEditMode: boolean = false;
  editCategoryId: number | null = null;
  @ViewChild('closeModal') closeModal!: ElementRef;



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
    this.commonService.get('admin/get-all-property-category').subscribe({
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

  onSubmit() {
    this.Form.markAllAsTouched();
    const name = this.Form.value.name?.trim();

    if (!name) {
      return;
    }

    if (this.Form.valid) {
      this.isLoading = true;

      // ✅ Use FormData instead of URLSearchParams
      const formData = new FormData();
      formData.append('title', this.Form.value.name);

      if (this.selectedLogoFile) {
        formData.append('image', this.selectedLogoFile);
      }

      if (this.isEditMode && this.editCategoryId) {
        // 🔹 UPDATE API
        this.commonService.post(
          `admin/update-property-category/${this.editCategoryId.toString()}`,
          formData
        ).subscribe({
          next: (resp: any) => {
            this.isLoading = false;
            if (resp.success) {
              this.toastr.success(resp.message);
              this.getDetails(); // refresh table
              this.resetForm();
              this.closeModal.nativeElement.click();
            } else {
              this.toastr.warning(resp.message);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.warning(error || 'Something went wrong!');
          }
        });

      } else {
        // 🔹 ADD API
        this.commonService.post('admin/create-property-category', formData).subscribe({
          next: (resp: any) => {
            this.isLoading = false;
            if (resp.success) {
              this.toastr.success(resp.message);
              this.getDetails();
              this.resetForm();
              this.closeModal.nativeElement.click();
            } else {
              this.toastr.warning(resp.message);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.warning(error || 'Something went wrong!');
          }
        });
      }
    }
  }


  resetForm() {
    this.Form.reset();
    this.profile_image = null;
    this.selectedLogoFile = null;
    this.isEditMode = false;
    this.editCategoryId = null;
  }


  // deleteCategory(id: number) {
  //   if (confirm('Are you sure you want to delete this category?')) {
  //     const formURlData = new URLSearchParams();
  //     formURlData.set('property_category_id', id.toString());

  //     this.commonService.post('admin/delete-category', formURlData.toString()).subscribe({
  //       next: (resp: any) => {
  //         if (resp.success) {
  //           this.toastr.success(resp.message);
  //           this.getDetails();
  //         } else {
  //           this.toastr.warning(resp.message);
  //         }
  //       },
  //       error: (error) => {
  //         this.toastr.warning(error || 'Something went wrong!');
  //       }
  //     });
  //   }
  // }

  openEdit(item: any) {
    this.isEditMode = true;
    this.editCategoryId = item.property_category_id; // adjust according to API response
    this.Form.patchValue({
      name: item.title
    });
    this.profile_image = item.image || null; // load preview from server
  }


  openAdd() {
    this.isEditMode = false;
    this.editCategoryId = null;
    this.resetForm();
  }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedLogoFile = file;

      // For image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profile_image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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


}
