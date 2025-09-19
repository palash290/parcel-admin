import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';

Swiper.use([Navigation, Thumbs]);

@Component({
  selector: 'app-view-post',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.css'
})
export class ViewPostComponent {

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


}
