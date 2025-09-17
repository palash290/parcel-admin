import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-agent',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-agent.component.html',
  styleUrl: './view-agent.component.css'
})
export class ViewAgentComponent {

  agent_id: any;
  carFeaturesList: string[] = [];
  clientsList: any;
  agentData: any;
  userImg1: any;
  isLoading: boolean = false;
  @ViewChild('closeModalAcc') closeModalAcc!: ElementRef;
  @ViewChild('closeModalRej') closeModalRej!: ElementRef;

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService, private location: Location) { }

  ngOnInit() {
    this.agent_id = this.route.snapshot.queryParamMap.get('agent_id');
    this.getSingleSeller(this.agent_id);
  }

  getSingleSeller(seller_id?: any) {
    this.isLoading = true;
    this.service.get(`admin/get-agent/${seller_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.agentData = resp.data;
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  reject() {
    this.isLoading = true;
    const formURlData = new URLSearchParams()
    formURlData.set('seller_status', 'REJECTED')
    formURlData.set('agent_id', this.agent_id)
    this.service
      .post('admin/approve-reject-seller', formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalRej.nativeElement.click();
            this.getSingleSeller();
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

  accept() {
    this.isLoading = true;
    const formURlData = new URLSearchParams()
    formURlData.set('seller_status', 'APPROVED')
    formURlData.set('agent_id', this.agent_id)
    this.service
      .post('admin/approve-reject-seller', formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalAcc.nativeElement.click();
            this.getSingleSeller();
          } else {
            this.isLoading = false;
            this.toastr.warning(resp.message);
          }
        },
        error: (error: any) => {
          // if (error.error.message) {
          //   this.toastr.error(error.error.message);
          // } else {
          //   this.toastr.error('Something went wrong!');
          // }
          this.isLoading = false;
          this.toastr.warning(error || 'Something went wrong!');
        }
      })
  }

  backClicked() {
    this.location.back();
  }


}
