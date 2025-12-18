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
  images: any = [
    'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg',
    'img/np_pro.png',
    'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg'
  ];
  property_videos: any;
  property_reels: any;
  thumbsSwiper: any;
  @ViewChild('closeModalAcc') closeModalAcc!: ElementRef;
  @ViewChild('closeModalRej') closeModalRej!: ElementRef;
  placeholderImage = 'img/empty_doc.png';
  property_around: any;

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService) { }

  ngOnInit() {
    this.property_id = this.route.snapshot.queryParamMap.get('property_id');
    this.getSingleProperty(this.property_id);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.thumbsSwiper = new Swiper('.mySwiperThumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        loop: false
      });
    }, 1000);
  }

  getSingleProperty(property_id: any) {
    //this.isLoading = true;
    this.service.get(`admin/property-details/${property_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.properyData = resp.data;
        //this.images = resp.data.images;
        this.property_reels = resp.data.property_reels;
        this.property_videos = resp.data.property_videos;
        const raw = resp.data.property_around;

        if (raw) {
          try {
            // Try parsing directly
            this.property_around = JSON.parse(raw);
          } catch {
            try {
              // If it fails, fix single quotes and retry
              const fixed = raw.replace(/'/g, '"');
              this.property_around = JSON.parse(fixed);
            } catch {
              console.error("Invalid property_around format:", raw);
              this.property_around = [];
            }
          }
        } else {
          this.property_around = [];
        }
        this.loadSwiper();
      },
      error: error => {
        this.isLoading = false;
      }
    });
  }

  loadSwiper() {
    new Swiper('.mySwiperMain', {
      spaceBetween: 10,
      loop: this.properyData?.listing.images?.length > 1,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: this.thumbsSwiper,
      },
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

  getDisplayImages(images: any[]): string[] {
    const files = images?.map(i => i.file) || [];

    if (files.length >= 4) {
      return files.slice(0, 4);
    } else {
      // fill remaining with placeholder
      const needed = 4 - files.length;
      return [...files, ...Array(needed).fill(this.placeholderImage)];
    }
  }


}
