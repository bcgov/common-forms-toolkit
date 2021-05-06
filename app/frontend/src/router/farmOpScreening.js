/**
 * Farm Operator Screening Form Routes
 */
import { FormNames } from '@/utils/constants';

const baseName = 'FarmOpScreening';
const baseTitle = 'Farm Operator Screening';

export default [
  {
    path: `/${FormNames.FARMOPSCREENING}`,
    component: () => import(/* webpackChunkName: "farmopscreening" */ '@/views/FarmOpScreening.vue'),
    children: [
      {
        path: '',
        name: `${baseName}Form`,
        component: () => import(/* webpackChunkName: "farmopscreening-form" */ '@/views/farmopscreening/Root.vue'),
        meta: {
          title: baseTitle
        }
      },
      {
        path: 'admin',
        name: `${baseName}Admin`,
        component: () => import(/* webpackChunkName: "farmopscreening-admin" */ '@/views/farmopscreening/Admin.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true,
          title: `${baseTitle} Admin`
        }
      },
      {
        path: 'admin/dashboard',
        name: `${baseName}Dashboards`,
        component: () => import(/* webpackChunkName: "farmopscreening-dashboard" */ '@/views/farmopscreening/Dashboards.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true,
          title: `${baseTitle} Admin`
        }
      },
      {
        path: 'admin/settings',
        name: `${baseName}Settings`,
        component: () => import(/* webpackChunkName: "farmopscreening-settings" */ '@/views/farmopscreening/Settings.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true,
          title: `${baseTitle} Settings`
        }
      },
      {
        path: 'admin/submission/:submissionId',
        name: `${baseName}Submission`,
        component: () => import(/* webpackChunkName: "farmopscreening-submission" */ '@/views/farmopscreening/Submission.vue'),
        props: true,
        meta: {
          hasLogin: true,
          requiresAuth: true,
          title: `${baseTitle} Submission`
        }
      },
      {
        path: 'admin/team',
        name: `${baseName}Team`,
        component: () => import(/* webpackChunkName: "farmopscreening-team" */ '@/views/farmopscreening/Team.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true,
          title: `${baseTitle} Team Management`
        }
      },
      {
        path: 'review/:submissionId',
        name: `${baseName}Review`,
        component: () => import(/* webpackChunkName: "farmopscreening-review" */ '@/views/farmopscreening/Review.vue'),
        props: true,
        meta: {
          title: `${baseTitle} Submission Review`
        }
      },
    ]
  },
];
