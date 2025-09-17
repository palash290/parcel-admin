import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-view-listed-properties',
  imports: [RouterLink, CommonModule, NgxPaginationModule],
  templateUrl: './view-listed-properties.component.html',
  styleUrl: './view-listed-properties.component.css'
})
export class ViewListedPropertiesComponent {

  agent_id: any;
  agentData: any;
  userImg1: any;
  isLoading: boolean = false;
  p: any = 1;


  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService) { }

  ngOnInit() {
    this.agent_id = this.route.snapshot.queryParamMap.get('agent_id');
    this.getSingleSeller(this.agent_id);
  }

  getSingleSeller(seller_id?: any) {
    this.isLoading = true;
    this.service.get(`admin/get-agent-listed-properties/${seller_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.agentData = resp.data;
        this.filterTable();
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  searchText: string = '';
  filteredData: any[] = [];

  filterTable() {
    this.p = 1;
    let filtered = this.agentData;
    // Filter by customer name
    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: any) =>
      (item.full_name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }


}
