import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  data: any;
  recent_investor: any;
  recent_seller: any;

  constructor(private commonService: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.commonService.get('admin/dashboard-summary').subscribe({
      next: (resp: any) => {
        this.data = resp.data.summary;
        this.recent_investor = resp.data.recent_investor_applications;
        this.recent_seller = resp.data.recent_seller_applications;
      },
      error: (error) => {
        console.log(error || 'Something went wrong!');
      }
    });
  }


}
