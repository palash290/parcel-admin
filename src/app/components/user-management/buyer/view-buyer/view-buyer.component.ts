import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-buyer',
  imports: [CommonModule],
  templateUrl: './view-buyer.component.html',
  styleUrl: './view-buyer.component.css'
})
export class ViewBuyerComponent {

  buyer_id: any;
  buyerData: any;
  isLoading: boolean = false;
  @ViewChild('closeModalAcc') closeModalAcc!: ElementRef;
  @ViewChild('closeModalRej') closeModalRej!: ElementRef;

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService, private sanitizer: DomSanitizer, private location: Location) { }

  ngOnInit() {
    this.buyer_id = this.route.snapshot.queryParamMap.get('buyer_id');
    this.getSingleSeller(this.buyer_id);
  }

  getSingleSeller(seller_id?: any) {
    this.isLoading = true;
    this.service.get(`admin/get-investors/${seller_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.buyerData = resp.data;
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  getBedrooms(no_of_bedrooms: string | null | undefined): string[] {
    if (!no_of_bedrooms) return [];

    return no_of_bedrooms.split(',')
      .map(b => {
        const num = parseInt(b.trim(), 10);
        return num >= 5 ? '4+' : num.toString();
      });
  }

  getPropertyTypes(property_type: string | null | undefined): string[] {
    if (!property_type) return [];

    return property_type
      .split(',')
      .map(type => type.trim())
      .filter(type => type.length > 0);
  }

  getPropertyFor(property_for: string | null | undefined): string[] {
    if (!property_for) return [];

    return property_for
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  previewImg: any = null;

  getImg(img: any) {
    this.previewImg = img;
  }


  selectedFile: string = '';
  safeFileUrl!: SafeResourceUrl;
  isPdf: boolean = false;

  openPreview(url: string) {
    if (!url) return;

    this.selectedFile = url;
    this.isPdf = url.toLowerCase().includes('.pdf');

    // ✅ Sanitize the URL
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  reject() {
    this.isLoading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('type', 'investor')
    formURlData.set('rejection_reason ', 'document mismatched');
    formURlData.set('status', '2')
    this.service
      .post(`admin/update-application-status/${this.buyer_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalRej.nativeElement.click();
            this.getSingleSeller(this.buyer_id);
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
    formURlData.set('type', 'investor')
    formURlData.set('status', '1')
    this.service
      .post(`admin/update-application-status/${this.buyer_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalAcc.nativeElement.click();
            this.getSingleSeller(this.buyer_id);
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


}
