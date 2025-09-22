import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-buyer',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-buyer.component.html',
  styleUrl: './view-buyer.component.css'
})
export class ViewBuyerComponent {

  buyer_id: any;
  buyerData: any;
  isLoading: boolean = false;

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService) { }

  ngOnInit() {
    this.buyer_id = this.route.snapshot.queryParamMap.get('buyer_id');
    this.getSingleSeller(this.buyer_id);
  }

  getSingleSeller(seller_id?: any) {
    this.isLoading = true;
    this.service.get(`admin/get-buyer/${seller_id}`).subscribe({
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


}
