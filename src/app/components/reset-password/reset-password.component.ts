import { Component } from '@angular/core';
import { ValidationErrorService } from '../../services/validation-error.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzFlexDirective } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  Form!: FormGroup;
  passwordMismatch = false;
  loading: boolean = false;
  isPasswordVisible2: boolean = false;
  isPasswordVisible3: boolean = false;
  verifyToken: any;


  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router) { }

  ngOnInit() {
    this.verifyToken = localStorage.getItem('verifyToken');
    this.initForm();
  }

  initForm() {
    this.Form = new FormGroup({
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', Validators.required),
    });
    //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    this.Form.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  onSubmit() {
    this.Form.markAllAsTouched();
    const newPassword = this.Form.value.new_password?.trim();

    if (!newPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    if (this.Form.valid && !this.passwordMismatch) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('forgot_code', this.verifyToken);
      formURlData.set('newPassword', this.Form.value.new_password);
      this.service.post('admin/reset-password', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toastr.success(resp.message);
            console.log(resp.message)
            this.Form.reset();
            this.loading = false;
            this.router.navigateByUrl('/');
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.warning(error);
        }
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.Form.get('new_password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return { passwordMismatch: true };
      } else {
        this.passwordMismatch = false;
        return null;
      }
    };
  }


  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }


  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
  }


}
