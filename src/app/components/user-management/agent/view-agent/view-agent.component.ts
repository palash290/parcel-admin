import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../services/common.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-agent',
  imports: [CommonModule],
  templateUrl: './view-agent.component.html',
  styleUrl: './view-agent.component.css'
})
export class ViewAgentComponent {

  agent_id: any;
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

  getSingleSeller(agent_id: any) {
    this.isLoading = true;
    this.service.get(`admin/get-sellers/${agent_id}`).subscribe({
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
    const formURlData = new URLSearchParams();
    formURlData.set('type', 'seller')
    formURlData.set('rejection_reason ', 'document mismatched');
    formURlData.set('status', '2')
    this.service
      .post(`admin/update-application-status/${this.agent_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalRej.nativeElement.click();
            this.getSingleSeller(this.agent_id);
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
    const formURlData = new URLSearchParams();
    formURlData.set('type', 'seller')
    formURlData.set('status', '1')
    this.service
      .post(`admin/update-application-status/${this.agent_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalAcc.nativeElement.click();
            this.getSingleSeller(this.agent_id);
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

  backClicked() {
    this.location.back();
  }

  previewImg: any = null;

  getImg(img: any) {
    this.previewImg = img;
  }


}
