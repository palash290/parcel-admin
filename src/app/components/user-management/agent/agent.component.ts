import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../../services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agent',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css'
})
export class AgentComponent {

  data: any;
  businessLogoUrl: string = '';
  p: any = 1;
  isLoading: boolean = false;

  constructor(private commonService: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.isLoading = true;
    this.commonService.get('admin/get-all-agents').subscribe({
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
      filtered = filtered.filter((item: { full_name: any; email: any; }) =>
      (item.full_name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  handleCheckboxChange(row: any) {
    if (row.is_active == false) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to unblock this agent!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('agent_id', '');
          this.commonService.post(`admin/agent-block-unblock/${row.agent_id}`, formURlData.toString()).subscribe({
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
        text: "You want to block this agent!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('agent_id', '');
          this.commonService.post(`admin/agent-block-unblock/${row.agent_id}`, formURlData.toString()).subscribe({
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
