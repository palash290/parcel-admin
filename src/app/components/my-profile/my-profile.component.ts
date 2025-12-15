import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  Form: FormGroup;
  isLoading: boolean = false;
  name: any;

  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService,
    private service: CommonService
  ) {
    this.getDetails();
    this.Form = this.fb.group({
      name: [' ', [Validators.required]],
      email: [{ value: ' ', disabled: true }],
    });

  }

  getDetails() {
    this.isLoading = true;
    this.service.get('admin/profile').subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.isLoading = false;
          this.Form.patchValue({
            name: resp.data.full_name,
            email: resp.data.email,
          });
          this.name = resp.data.full_name;
          this.profile_image = resp.data.profile_image;
        } else {
          this.isLoading = false;
          this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.warning(error.error?.message || 'Something went wrong!');
      }
    });
  }

  profile_image: any = ''; // Will be used for preview
  selectedLogoFile: File | null = null; // For uploading in FormData

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


  submitDetails() {
    const trimmedMessage = this.Form.value.name.trim();
    if (trimmedMessage === '') {
      //this.isDisabled = false;
      return;
    }
    this.Form.markAllAsTouched();
    this.isLoading = true;
    const formData = new FormData();

    formData.append('full_name', this.Form.value.name);

    // Append image file if selected
    if (this.selectedLogoFile) {
      formData.append('profileImage', this.selectedLogoFile);
    }

    this.service.post('admin/profile-update', formData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.isLoading = false;
          this.toastr.success(resp.message);
          this.service.triggerRefresh();
          this.getDetails();
        } else {
          this.isLoading = false;
          this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.warning(error.error?.message || 'Something went wrong!');
      }
    });
  }


}
