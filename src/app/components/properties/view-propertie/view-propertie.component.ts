import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';

Swiper.use([Navigation, Thumbs]);

@Component({
  selector: 'app-view-propertie',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-propertie.component.html',
  styleUrl: './view-propertie.component.css'
})
export class ViewPropertieComponent {

  property_id: any;
  properyData: any;
  userImg1: any;
  isLoading: boolean = false;
  @ViewChild('closeModalAcc') closeModalAcc!: ElementRef;
  @ViewChild('closeModalRej') closeModalRej!: ElementRef;

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService) { }

  ngOnInit() {
    this.property_id = this.route.snapshot.queryParamMap.get('property_id');
    this.getSingleProperty(this.property_id);
  }

    thumbsSwiper: any;

  images = [
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' },
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' },
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' }
  ];

  ngAfterViewInit() {
    setTimeout(() => {
      this.thumbsSwiper = new Swiper('.mySwiperThumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        loop: false
      });

      new Swiper('.mySwiperMain', {
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: this.thumbsSwiper,
        },
      });
    }, 100);
  }

  getSingleProperty(property_id: any) {
    this.isLoading = true;
    this.service.get(`admin/get-property/${property_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.properyData = resp.data;
      },
      error: error => {
        this.isLoading = false;
      }
    });
  }

  reject() {
    this.isLoading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('status', 'REJECTED');
    this.service
      .patch(`admin/update-property-status/${this.property_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalRej.nativeElement.click();
            this.getSingleProperty(this.property_id);
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
    formURlData.set('status', 'APPROVED');
    this.service
      .patch(`admin/update-property-status/${this.property_id}`, formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalAcc.nativeElement.click();
            this.getSingleProperty(this.property_id);
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
