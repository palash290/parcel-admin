import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

Swiper.use([Navigation, Thumbs]);

@Component({
  selector: 'app-view-post',
  imports: [RouterLink, CommonModule],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.css'
})
export class ViewPostComponent {

  thumbsSwiper: any;
  postId: any;
  isLoading: boolean = false;
  showCmt: boolean = false;
  postData: any;
  cmtData: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  images = [
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' },
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' },
    { img: 'https://trophy-talk-bucket.s3.us-east-2.amazonaws.com/images/1758107753471-af89bb3d-artyom-kabajev-ZcCv6qUye8c-unsplash.jpg' }
  ];

  constructor(private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService, private router: Router) { }

  ngOnInit() {
    this.postId = this.route.snapshot.queryParamMap.get('property_reel_id');
    this.getSinglePost(this.postId);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.thumbsSwiper = new Swiper('.mySwiperThumbs1', {
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

  getSinglePost(post_id?: any) {
    this.isLoading = true;
    this.service.get(`admin/get-reel/${post_id}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.postData = resp.data;
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  toggleCmt(postId: any, cmtId: any) {
    this.showCmt = !this.showCmt;
    this.getComments(postId, cmtId)
  }

  getComments(postId: any, cmtId: any) {
    this.isLoading = true;
    this.service.get(`admin/get-comments/${postId}?parent_comment_id=${cmtId}`).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.cmtData = resp.data;
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  comments: any[] = []; // main comments
  expandedComments: { [key: number]: boolean } = {}; // track which comments are expanded
  replies: { [key: number]: any[] } = {}; // store replies for each comment
  isLoadingReplies: { [key: number]: boolean } = {}; // track loading state

  toggleReplies(commentId: number, postId: number) {
    this.expandedComments[commentId] = !this.expandedComments[commentId];

    // Fetch only if replies not loaded yet
    if (this.expandedComments[commentId] && !this.replies[commentId]) {
      this.isLoadingReplies[commentId] = true;
      this.service.get(`admin/get-comments/${postId}?parent_comment_id=${commentId}`).subscribe({
        next: (resp: any) => {
          this.isLoadingReplies[commentId] = false;
          this.replies[commentId] = resp.data || [];
        },
        error: (error) => {
          this.isLoadingReplies[commentId] = false;
          console.error('Error fetching replies:', error);
        }
      });
    }
  }

  deletePost() {
    this.isLoading = true;
    this.service
      .delete(`admin/delete-reel/${this.postId}`)
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoading = false;
            this.toastr.success(resp.message);
            this.closeModalDelete.nativeElement.click();
            this.router.navigateByUrl('/home/post-namagement');
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
