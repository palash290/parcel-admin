import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-post-management',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './post-management.component.html',
  styleUrl: './post-management.component.css'
})
export class PostManagementComponent {

  data: any;
  businessLogoUrl: string = '';
  postId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  p: any = 1;
  isLoading: boolean = false;

  constructor(private commonService: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    // const savedPage = localStorage.getItem('postPage');
    // this.p = savedPage ? Number(savedPage) : 1;
    this.getDetails();
  }


  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-reels').subscribe({
      next: (resp: any) => {
        this.data = resp.data;
        this.filterTable();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }

  searchText: string = '';
  filteredData: any[] = [];

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
    this.postId = id;
  }

  deletePost() {
    this.isLoading = true;
    this.commonService
      .delete(`admin/delete-reel/${this.postId}`)
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

  // onPageChange(page: number) {
  //   this.p = page;
  //   localStorage.setItem('postPage', String(page));
  // }


}
