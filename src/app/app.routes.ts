import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent)
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
            // canActivate: [authGuard],
            children: [
                  {
                        path: '',
                        redirectTo: 'dashboard',
                        pathMatch: 'full'
                  },
                  {
                        path: 'dashboard',
                        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'my-profile',
                        loadComponent: () => import('./components/my-profile/my-profile.component').then(m => m.MyProfileComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'notifications',
                        loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
                        // canActivate: [authGuard]
                  },

                  {
                        path: 'buyer',
                        loadComponent: () => import('./components/user-management/buyer/buyer.component').then(m => m.BuyerComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-buyer',
                        loadComponent: () => import('./components/user-management/buyer/view-buyer/view-buyer.component').then(m => m.ViewBuyerComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'agent',
                        loadComponent: () => import('./components/user-management/agent/agent.component').then(m => m.AgentComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-agent',
                        loadComponent: () => import('./components/user-management/agent/view-agent/view-agent.component').then(m => m.ViewAgentComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-listed-properties',
                        loadComponent: () => import('./components/user-management/agent/view-listed-properties/view-listed-properties.component').then(m => m.ViewListedPropertiesComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'properties',
                        loadComponent: () => import('./components/properties/properties.component').then(m => m.PropertiesComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-propertie',
                        loadComponent: () => import('./components/properties/view-propertie/view-propertie.component').then(m => m.ViewPropertieComponent)
                        // canActivate: [authGuard]
                  },

                  {
                        path: 'schedule-visit',
                        loadComponent: () => import('./components/schedule-visit/schedule-visit.component').then(m => m.ScheduleVisitComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-schedule',
                        loadComponent: () => import('./components/schedule-visit/view-schedule/view-schedule.component').then(m => m.ViewScheduleComponent)
                        // canActivate: [authGuard]
                  },

                  {
                        path: 'post-namagement',
                        loadComponent: () => import('./components/post-management/post-management.component').then(m => m.PostManagementComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-post',
                        loadComponent: () => import('./components/post-management/view-post/view-post.component').then(m => m.ViewPostComponent)
                        // canActivate: [authGuard]
                  },

                  {
                        path: 'rating-reviews',
                        loadComponent: () => import('./components/rating-reviews/rating-reviews.component').then(m => m.RatingReviewsComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'live-ama',
                        loadComponent: () => import('./components/live-ama/live-ama.component').then(m => m.LiveAmaComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'revenue',
                        loadComponent: () => import('./components/revenue/revenue.component').then(m => m.RevenueComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'listing&boost',
                        loadComponent: () => import('./components/listing-boost/listing-boost.component').then(m => m.ListingBoostComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'sweepstacks',
                        loadComponent: () => import('./components/sweepstacks/sweepstacks.component').then(m => m.SweepstacksComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'add-sweepstack',
                        loadComponent: () => import('./components/sweepstacks/add-sweepstack/add-sweepstack.component').then(m => m.AddSweepstackComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-sweepstack',
                        loadComponent: () => import('./components/sweepstacks/view-sweepstack/view-sweepstack.component').then(m => m.ViewSweepstackComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'referrals',
                        loadComponent: () => import('./components/referrals/referrals.component').then(m => m.ReferralsComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'referral-setting',
                        loadComponent: () => import('./components/referrals/referral-settings/referral-settings.component').then(m => m.ReferralSettingsComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'investor-management',
                        loadComponent: () => import('./components/investor-management/investor-management.component').then(m => m.InvestorManagementComponent)
                        // canActivate: [authGuard]
                  },
                  {
                        path: 'view-investor',
                        loadComponent: () => import('./components/investor-management/view-investor/view-investor.component').then(m => m.ViewInvestorComponent)
                        // canActivate: [authGuard]
                  },
            ]
      }
];
