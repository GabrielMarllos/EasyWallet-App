import {createRouter, createWebHistory} from "vue-router";

// Pages
import {useUserStore} from "../shared/store/user-store.store.js";
import RegisterComponent from "../authentication/pages/register.component.vue";
import LoginComponent from "../authentication/pages/login.component.vue";
import PasswordForgotComponent from "../authentication/pages/password-forgot.component.vue";
import PasswordRecoveryComponent from "../authentication/pages/password-recovery.component.vue";
import PageNotFoundComponent from "../shared/pages/page-not-found.component.vue";
import ProfileManagement from "../authentication/pages/profile-management.vue";
import SettingsComponent from "../settings/pages/settings.component.vue";
import JobsPostsPage from "../applicant/pages/jobs-posts.page.vue";
import ApplicantProfilePage from "../applicant/pages/applicant-profile.page.vue";
import RecruitmentsListPage from "../recruiter/pages/recruitments-list.page.vue";
import RecruiterInitPage from "../organizations/pages/recruiter-init.page.vue";
import OrganizationCreationForm from "../organizations/components/organization-creation-form.component.vue";
import OrganizationProfileComponent from "../organizations/pages/organization-profile.component.vue";
import RecruitmentDashboardComponent from "../recruiter/pages/recruitment-dashboard.component.vue";
import ApplicationsPage from "../applicant/pages/applications.page.vue";
import EmailHistoryPage from "../shared/pages/email-history.page.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
      // Authentication
      { path: '/login', name: 'Log In', component: LoginComponent, meta: { requiresAuth: false }},
      { path: '/register', name: 'Register', component: RegisterComponent, meta: { requiresAuth: false } },
      { path: '/forgot-password', name: 'Forgot Password', component: PasswordForgotComponent, meta: { requiresAuth: false } },
      { path: '/recover-password', name: 'Recover Password', component: PasswordRecoveryComponent, meta: { requiresAuth: false } },
      // User profile edit and settings
      { path: '/manage-profile', name: 'User Profile', component: ProfileManagement, meta: { requiresAuth: true } },
      { path: '/settings', name: 'Settings', component: SettingsComponent, meta: { requiresAuth: true } },

      // Email
      { path: '/email', name: 'Email', component: EmailHistoryPage, meta: { requiresAuth: true } },

      // Applicants
      { path: '/jobs', name: 'Job posts', component: JobsPostsPage, meta: { requiresAuth: true, requiresCandidate: true, requiresApplicant: true } },
      { path: '/profile', name: 'Applicant Profile', component: ApplicantProfilePage, meta: { requiresAuth: true, requiresApplicant: true } },
      { path: '/applications', name: 'Applications Page', component: ApplicationsPage, meta: { requiresAuth: true, requiresApplicant: true } },

      // Recruiters
      { path: '/init', name: 'Recruiters without company init page', component:RecruiterInitPage , meta: { requiresAuth: true, requiresRecruiter: true, requiresCompany: false} },
      { path: '/company-create', name: 'Company creation page', component:OrganizationCreationForm , meta: { requiresAuth: true, requiresRecruiter: true, requiresCompany: false} },
      { path: '/company-profile', name: 'Company profile page', component:OrganizationProfileComponent , meta: { requiresAuth: true, requiresRecruiter: true, requiresCompany: true} },
      { path: '/recruitments', name: 'Recruitments management', component:RecruitmentsListPage , meta: { requiresAuth: true, requiresRecruiter: true, requiresCompany: true} },
      { path: '/recruitment/:id/dashboard', name: 'Recruitment process dashboard', component:RecruitmentDashboardComponent , meta: { requiresAuth: true, requiresRecruiter: true, requiresCompany: true} },


      // Support
      { path: '/:pathMatch(.*)*', name: '404', component: PageNotFoundComponent, meta: { requiresAuth: true } },
      { path: '/', redirect: '/home'},
  ]
});

function handleApplicant(userStore, to, next) {
    // If the route requires an applicant and the user is not an applicant, redirect to home
    if (to.meta.requiresRecruiter) {
        next('/');
    }
    // If the user is trying to access the home path, redirect to jobs
    else if (to.path === '/home') {
        next('/jobs');
    }
    else {
        next();
    }
}

// Function to handle routing for recruiters
function handleRecruiter(userStore, to, next) {
    // If the router requires an applicant
    if (to.meta.requiresApplicant) {
        next('/');
    }
    // If the route requires a company and the user does not have a company, redirect to init
    else if (to.meta.requiresCompany && !userStore.hasCompany) {
        next('/init');
    }
    // If the user is trying to access the home path, redirect based on whether they have a company
    else if (to.path === '/home') {
        userStore.hasCompany ? next('/recruitments') : next('/init');
    }
    else {
        next();
    }
}

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    // If the route requires authentication and the user is not authenticated, redirect to login
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        next('/login');
    }
    // If the route does not require authentication and the user is authenticated, redirect to home
    else if (!to.meta.requiresAuth && userStore.isAuthenticated) {
        next('/');
    }
    // If the user is an applicant, call the handleApplicant function
    else if (userStore.role === 'ROLE_APPLICANT') {
        handleApplicant(userStore, to, next);
    }
    // If the user is a recruiter, call the handleRecruiter function
    else if (userStore.role === 'ROLE_RECRUITER') {
        handleRecruiter(userStore, to, next);
    }
    else {
        next();
    }
});

export default router;