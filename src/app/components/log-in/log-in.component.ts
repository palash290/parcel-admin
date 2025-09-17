import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { integerValidator, NoWhitespaceDirective, passwordMatchValidator, passwordMismatchValidator, strongPasswordValidator } from '../../helper/validators';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QuillModule } from 'ngx-quill';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, NzSelectModule, QuillModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  Form: FormGroup;
  atValues: any;
  htmlText: string = '';
  isLoading: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService, private route: Router,
    private service: CommonService
  ) {
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.isLoading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.Form.value.email);
      formURlData.set('password', this.Form.value.password);
      this.service.post('admin/login', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.service.setToken(resp.token);
            this.toastr.success(resp.message);
            this.isLoading = false;
            this.route.navigateByUrl('/home/dashboard')
          } else {
            this.toastr.warning(resp.message);
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.warning(error || 'Something went wrong!');
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
