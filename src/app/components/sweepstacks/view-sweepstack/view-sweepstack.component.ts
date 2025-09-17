import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
Swiper.use([Navigation, Thumbs]);

@Component({
  selector: 'app-view-sweepstack',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-sweepstack.component.html',
  styleUrl: './view-sweepstack.component.css'
})
export class ViewSweepstackComponent {

  sweepstakes_id: any;
  data: any;
  isLoading: boolean = false;
  thumbsSwiper: any;

  constructor(private toastr: NzMessageService, private router: ActivatedRoute, private service: CommonService) { }

  ngOnInit() {
    this.sweepstakes_id = this.router.snapshot.queryParamMap.get('sweepstakes_id');
    this.getDetails();
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
    }, 1000);
  }

  getDetails() {
    this.isLoading = true;
    this.service.get(`admin/get-sweepstakes-by-id/${this.sweepstakes_id}`).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.data = resp.data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastr.warning(resp.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error || 'Something went wrong!');
      }
    });
  }


}
