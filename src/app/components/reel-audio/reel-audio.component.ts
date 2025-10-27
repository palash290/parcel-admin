import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { ValidationErrorService } from '../../services/validation-error.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reel-audio',
  imports: [CommonModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reel-audio.component.html',
  styleUrl: './reel-audio.component.css'
})
export class ReelAudioComponent {

  Form!: FormGroup;
  data: any;
  p: any = 1;
  isLoading: boolean = false;
  searchText: string = '';
  filteredData: any[] = [];
  audioUrl: string | null = null;
  selectedAudioFile: File | null = null;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;


  constructor(private commonService: CommonService, private toastr: NzMessageService, private fb: FormBuilder,
    public validationErrorService: ValidationErrorService) { }

  ngOnInit() {
    this.getDetails();
    this.initForm();
  }

  initForm() {
    this.Form = this.fb.group({
      songname: ['', [Validators.required]],
      artistname: ['', [Validators.required]],
    });
  }

  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/musics').subscribe({
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
      (item.songName?.toLowerCase().includes(keyword) ||
        item.artist?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  onAudioChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedAudioFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.audioUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.audioError = '';
    }
  }

  audioError: string = '';

  onSubmit() {
    this.Form.markAllAsTouched();
    const song = this.Form.value.songname?.trim();
    const artist = this.Form.value.artistname?.trim();

    if (!this.selectedAudioFile) {
      this.audioError = 'Please select an audio file.';
      return;
    }

    if (!song || !artist) {
      return;
    }

    if (this.Form.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('songName', this.Form.value.songname);
      formData.append('artist', this.Form.value.artistname);

      if (this.selectedAudioFile) {
        formData.append('song', this.selectedAudioFile); // attach image
      }

      this.commonService.post(`admin/music`, formData).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          if (resp.success) {
            this.toastr.success(resp.message);
            this.getDetails();
            this.closeModal.nativeElement.click();
            this.Form.reset();
            this.selectedAudioFile = null;
            this.audioUrl = null;
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

  reelId: any;

  getPostId(id: any) {
    this.reelId = id;
  }

  reelDet: any;

  getDet(det: any) {
    this.reelDet = det;
  }

  deletePost() {
    this.isLoading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('buyer_id', '');
    this.commonService.post(`admin/delete-music/${this.reelId}`, formURlData.toString())
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

  handleCheckboxChange(row: any) {
    if (row.is_active == false) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to unblock this audio!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('buyer_id', '');
          this.commonService.post(`admin/music/${row.id}`, formURlData.toString()).subscribe({
            next: (resp: any) => {
              this.toastr.success(resp.message);
              this.getDetails();
            }
          })
        } else {
          this.getDetails();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to block this audio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('buyer_id', '');
          this.commonService.post(`admin/music/${row.id}`, formURlData.toString()).subscribe({
            next: (resp: any) => {
              this.toastr.success(resp.message);
              this.getDetails();
            }
          })
        } else {
          this.getDetails();
        }
      });
    }
  }


}
