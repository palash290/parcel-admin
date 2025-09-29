import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-properties',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

  data: any;
  p: any = 1;
  isLoading: boolean = false;

  constructor(private commonService: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-properties').subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.data = resp.data;
        this.filterTable();
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }

  searchText: string = '';
  filteredData: any[] = [];
  selectedStatus: string = 'ALL';

  filterTable() {
    this.p = 1;
    let filtered = this.data;

    if (this.selectedStatus != 'ALL') {
      filtered = filtered.filter((item: { status: string; }) => item.status == this.selectedStatus);
    }

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { property_title: string; agent: any; }) =>
      (item.property_title?.toLowerCase().includes(keyword) ||
        item.agent.full_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

    onEmfStatusChange(id: any, overrideStatus: any): void {
      const statusToUse = overrideStatus;
  
      if (!statusToUse) {
        this.toastr.warning('Please select a valid status');
        return;
      }
  
      const statusLabels: any = {
        APPROVED: 'Approve',
        REJECTED: 'Reject',
      };
  
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to change Status to "${statusLabels[statusToUse]}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('status', statusToUse);
  
          this.commonService.patch(`admin/update-property-status/${id}`, formURlData.toString()).subscribe({
            next: (resp: any) => {
              this.toastr.success(resp.message || 'Status updated successfully!');
              this.getDetails();
            },
            error: (err) => {
              this.toastr.warning('Failed to update Status');
              this.getDetails();
            }
          });
        } else {
          this.toastr.warning('Action cancelled');
          this.getDetails();
        }
      });
    }


}
