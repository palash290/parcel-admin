import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent),
            canActivate: [loginGuard]
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
            path: 'reset-password',
            loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
            path: 'verify-otp',
            loadComponent: () => import('./components/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
      },
      {
            path: 'home',
            loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent),
            canActivate: [authGuard],
            children: [
                  {
                        path: '',
                        redirectTo: 'dashboard',
                        pathMatch: 'full'
                  },
                  {
                        path: 'dashboard',
                        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
                  },
                  {
                        path: 'my-profile',
                        loadComponent: () => import('./components/my-profile/my-profile.component').then(m => m.MyProfileComponent)
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
                  },
                  {
                        path: 'notifications',
                        loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
                  },
                  {
                        path: 'buyer',
                        loadComponent: () => import('./components/user-management/buyer/buyer.component').then(m => m.BuyerComponent)
                  },
                  {
                        path: 'view-buyer',
                        loadComponent: () => import('./components/user-management/buyer/view-buyer/view-buyer.component').then(m => m.ViewBuyerComponent)
                  },
                  {
                        path: 'agent',
                        loadComponent: () => import('./components/user-management/agent/agent.component').then(m => m.AgentComponent)
                  },
                  {
                        path: 'view-agent',
                        loadComponent: () => import('./components/user-management/agent/view-agent/view-agent.component').then(m => m.ViewAgentComponent)
                  },
                  {
                        path: 'view-listed-properties',
                        loadComponent: () => import('./components/user-management/agent/view-listed-properties/view-listed-properties.component').then(m => m.ViewListedPropertiesComponent)
                  },
                  {
                        path: 'properties',
                        loadComponent: () => import('./components/properties/properties.component').then(m => m.PropertiesComponent)
                  },
                  {
                        path: 'view-propertie',
                        loadComponent: () => import('./components/properties/view-propertie/view-propertie.component').then(m => m.ViewPropertieComponent)
                  },
                  {
                        path: 'schedule-visit',
                        loadComponent: () => import('./components/schedule-visit/schedule-visit.component').then(m => m.ScheduleVisitComponent)
                  },
                  {
                        path: 'view-schedule',
                        loadComponent: () => import('./components/schedule-visit/view-schedule/view-schedule.component').then(m => m.ViewScheduleComponent)
                  },
                  {
                        path: 'post-namagement',
                        loadComponent: () => import('./components/post-management/post-management.component').then(m => m.PostManagementComponent)
                  },
                  {
                        path: 'view-post',
                        loadComponent: () => import('./components/post-management/view-post/view-post.component').then(m => m.ViewPostComponent)
                  },
                  {
                        path: 'rating-reviews',
                        loadComponent: () => import('./components/rating-reviews/rating-reviews.component').then(m => m.RatingReviewsComponent)
                  },
                  {
                        path: 'live-ama',
                        loadComponent: () => import('./components/live-ama/live-ama.component').then(m => m.LiveAmaComponent)
                  },
                  {
                        path: 'revenue',
                        loadComponent: () => import('./components/revenue/revenue.component').then(m => m.RevenueComponent)
                  },
                  {
                        path: 'listing&boost',
                        loadComponent: () => import('./components/listing-boost/listing-boost.component').then(m => m.ListingBoostComponent)
                  },
                  {
                        path: 'sweepstacks',
                        loadComponent: () => import('./components/sweepstacks/sweepstacks.component').then(m => m.SweepstacksComponent)
                  },
                  {
                        path: 'add-sweepstack',
                        loadComponent: () => import('./components/sweepstacks/add-sweepstack/add-sweepstack.component').then(m => m.AddSweepstackComponent)
                  },
                  {
                        path: 'view-sweepstack',
                        loadComponent: () => import('./components/sweepstacks/view-sweepstack/view-sweepstack.component').then(m => m.ViewSweepstackComponent)
                  },
                  {
                        path: 'referrals',
                        loadComponent: () => import('./components/referrals/referrals.component').then(m => m.ReferralsComponent)
                  },
                  {
                        path: 'referral-setting',
                        loadComponent: () => import('./components/referrals/referral-settings/referral-settings.component').then(m => m.ReferralSettingsComponent)
                  },
                  {
                        path: 'investor-management',
                        loadComponent: () => import('./components/investor-management/investor-management.component').then(m => m.InvestorManagementComponent)
                  },
                  {
                        path: 'view-investor',
                        loadComponent: () => import('./components/investor-management/view-investor/view-investor.component').then(m => m.ViewInvestorComponent)
                  },
                  {
                        path: 'category-management',
                        loadComponent: () => import('./components/category-management/category-management.component').then(m => m.CategoryManagementComponent)
                  },
                  {
                        path: 'amenity-management',
                        loadComponent: () => import('./components/amenity-management/amenity-management.component').then(m => m.AmenityManagementComponent)
                  },
                  {
                        path: 'reel-audio',
                        loadComponent: () => import('./components/reel-audio/reel-audio.component').then(m => m.ReelAudioComponent)
                  },
                  {
                        path: 'ranch-management',
                        loadComponent: () => import('./components/ranch-management/ranch-management.component').then(m => m.RanchManagementComponent)
                  },
                  {
                        path: 'add-ranch',
                        loadComponent: () => import('./components/ranch-management/add-ranch/add-ranch.component').then(m => m.AddRanchComponent)
                  },
                  {
                        path: 'view-ranch',
                        loadComponent: () => import('./components/ranch-management/view-ranch/view-ranch.component').then(m => m.ViewRanchComponent)
                  },
            ]
      }
];
