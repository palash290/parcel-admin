import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-sweepstacks',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './sweepstacks.component.html',
  styleUrl: './sweepstacks.component.css'
})
export class SweepstacksComponent {

  data: any;
  businessLogoUrl: string = '';
  sweepstakes_id: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  p: any = 1;
  isLoading: boolean = false;
  total_winners: any;
  total_revenue: any;
  total_entries: any;
  active_sweepstakes: any;

  constructor(private commonService: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getDetails();
  }


  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-sweepstakes').subscribe({
      next: (resp: any) => {
        this.data = resp.data.finalSweepstakes;
        this.total_winners = resp.data.total_winners;
        this.total_revenue = resp.data.total_revenue;
        this.total_entries = resp.data.total_entries;
        this.active_sweepstakes = resp.data.active_sweepstakes;
        this.filterTable();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.data = [];
        console.log(error || 'Something went wrong!');
      }
    });
  }

  searchText: string = '';
  filteredData: any[] = [];

  filterTable() {
    this.p = 1;
    let filtered = this.data;
    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: any) =>
      (item.full_name?.toLowerCase().includes(keyword) ||
        item.business_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  getPostId(id: any) {
    this.sweepstakes_id = id;
  }

  deletePost() {
    this.isLoading = true;
    this.commonService
      .delete(`admin/delete-sweepstakes/${this.sweepstakes_id}`)
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
