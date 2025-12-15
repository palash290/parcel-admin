import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  Form: FormGroup;
  atValues: any;
  htmlText: string = '';
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService,
    private service: CommonService, private route: Router
  ) {
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.Form.markAllAsTouched()
    if (this.Form.valid) {
      this.isLoading = true
      const formURlData = new URLSearchParams()
      formURlData.set('email', this.Form.value.email)
      this.service
        .post('admin/forgot-password', formURlData.toString())
        .subscribe({
          next: (resp: any) => {
            if (resp.success == true) {
              this.isLoading = false;
              // localStorage.setItem('verifyToken', resp.data);
              this.toastr.success(resp.message);
              this.route.navigate(['/']);
              // this.route.navigate(['/verify-otp'], {
              //   queryParams: { email: this.Form.value.email }
              // });
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


}
