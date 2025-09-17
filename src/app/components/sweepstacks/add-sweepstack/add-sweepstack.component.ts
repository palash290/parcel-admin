import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ValidationErrorService } from '../../../services/validation-error.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-add-sweepstack',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-sweepstack.component.html',
  styleUrl: './add-sweepstack.component.css'
})
export class AddSweepstackComponent {

  name: any;
  email: any;
  Form!: FormGroup;
  isLoading: boolean = false;
  sweepstakes_id: any;
  today: string = '';
  deleteIds: number[] = [];

  constructor(private fb: FormBuilder, private toastr: NzMessageService, private route: Router,
    private service: CommonService, public validationErrorService: ValidationErrorService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
    this.sweepstakes_id = this.router.snapshot.queryParamMap.get('sweepstakes_id');
    if (this.sweepstakes_id) {
      this.getDetails();
    }
    this.Form = this.fb.group({
      name: ['', Validators.required],
      free_pack_name: ['', Validators.required],
      free_entry_price: [{ value: 'Free', disabled: true }],
      first_bundle_name: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      first_entry_price: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      second_bundle_name: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      second_entry_price: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      third_bundle_name: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      third_entry_price: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      winning_amount: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/)
      ]],
      sweepstakes_description: ['', Validators.required],
    },
      { validators: this.dateRangeValidator.bind(this) });
  }

  dateRangeValidator(form: FormGroup) {
    const start = form.get('start_date')?.value;
    const end = form.get('end_date')?.value;

    if (!start || !end) {
      return null; // one of them is empty, don't validate yet
    }

    // convert to date so comparison works (string compare also works if format is yyyy-mm-dd)
    return end >= start ? null : { endDateInvalid: true };
  }


  getDetails() {
    this.isLoading = true;
    this.service.get(`admin/get-sweepstakes-by-id/${this.sweepstakes_id}`).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.isLoading = false;
          const startDate = resp.data.start_date ? resp.data.start_date.split('T')[0] : '';
          const endDate = resp.data.end_date ? resp.data.end_date.split('T')[0] : '';
          this.Form.patchValue({
            name: resp.data.sweepstakes_name,
            free_pack_name: resp.data.sweepstakes_pack.free_pack_name,
            free_entry_price: 'Free',
            first_bundle_name: resp.data.sweepstakes_pack.first_bundle_name,
            first_entry_price: Number(resp.data.sweepstakes_pack.first_entry_price),
            second_bundle_name: resp.data.sweepstakes_pack.second_bundle_name,
            second_entry_price: Number(resp.data.sweepstakes_pack.second_entry_price),
            third_bundle_name: resp.data.sweepstakes_pack.third_bundle_name,
            third_entry_price: Number(resp.data.sweepstakes_pack.third_entry_price),
            start_date: startDate,
            end_date: endDate,
            winning_amount: Number(resp.data.winning_amount),
            sweepstakes_description: resp.data.sweepstakes_description
          });

          // if product images already exist, show them in the preview list
          if (resp.data.files && resp.data.files.length) {
            resp.data.files.forEach((f: any) => {
              this.selectedImages.push({
                file: null,
                url: f.file,
                id: f.sweepstakes_media_id
              });
            });
          }
        } else {
          this.isLoading = false;
          this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }

  submitDetails(): void {

    const formValues = this.Form.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const value = formValues[key];
        if (typeof value === 'string' && value.trim() === '') {
          this.isLoading = false;
          return;
        }
      }
    }

    this.Form.markAllAsTouched();
    if (this.selectedImages.length == 0) {
      //this.toastr.warning('Please upload at least 1 image');
      return;
    }
    if (this.Form.invalid) { return; }
    this.isLoading = true;
    const formData = new FormData();

    formData.append('sweepstakes_name', this.Form.value.name);
    formData.append('free_pack_name', this.Form.value.free_pack_name);
    //formData.append('free_entry_price', this.Form.value.free_entry_price);
    formData.append('first_bundle_name', this.Form.value.first_bundle_name);
    formData.append('first_entry_price', this.Form.value.first_entry_price);
    formData.append('second_bundle_name', this.Form.value.second_bundle_name);
    formData.append('second_entry_price', this.Form.value.second_entry_price);
    formData.append('third_bundle_name', this.Form.value.third_bundle_name);
    formData.append('third_entry_price', this.Form.value.third_entry_price);
    formData.append('start_date', this.Form.value.start_date);
    formData.append('end_date', this.Form.value.end_date);
    formData.append('winning_amount', this.Form.value.winning_amount);
    formData.append('sweepstakes_description', this.Form.value.sweepstakes_description);

    // append deleteIds when updating
    if (this.sweepstakes_id && this.deleteIds.length) {
      formData.append('deleteIds', this.deleteIds.join(','));
    }

    // append files to formData
    this.selectedImages.forEach((item, index) => {
      if (item.file) {
        formData.append('file', item.file);
      }
    });

    this.service.post(this.sweepstakes_id ? `admin/update-sweepstakes/${this.sweepstakes_id}` : 'admin/add-sweepstakes', formData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.isLoading = false;
          this.toastr.success(resp.message);
          this.Form.reset();
          this.route.navigateByUrl('/home/sweepstakes');
        } else {
          this.isLoading = false;
          this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.warning(error || 'Something went wrong!');
      }
    });
  }

  selectedImages: any[] = [];

  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) { return; }

    Array.from(target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push({
          file: file,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    });

    target.value = '';
  }

  removeImage(index: number): void {
    const img = this.selectedImages[index];

    // when file === null, it means it's from backend and contains the 'id'
    if (!img.file && img.id) {
      this.deleteIds.push(img.id);
    }

    this.selectedImages.splice(index, 1);
  }


}
