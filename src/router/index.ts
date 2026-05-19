import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const LoginPage = () => import('@/pages/LoginPage.vue');
const RegisterPage = () => import('@/pages/RegisterPage.vue');
const CitizenHomePage = () => import('@/pages/CitizenHomePage.vue');
const DoctorHomePage = () => import('@/pages/DoctorHomePage.vue');
const NotFoundPage = () => import('@/pages/NotFoundPage.vue');
const AppShell = () => import('@/layouts/AppShell.vue');

const routes: RouteRecordRaw[] = [
  { path: '/login', component: LoginPage, name: 'login', meta: { public: true } },
  { path: '/register', component: RegisterPage, name: 'register', meta: { public: true } },
  {
    path: '/',
    component: AppShell,
    children: [
      { path: '', name: 'home', redirect: (to) => routeHome(to) },
      {
        path: 'cittadino',
        name: 'citizen-home',
        component: CitizenHomePage,
        meta: { roles: ['patient'] },
      },
      {
        path: 'medico',
        name: 'doctor-home',
        component: DoctorHomePage,
        meta: { roles: ['doctor'] },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: NotFoundPage, name: 'not-found', meta: { public: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const isPublic = to.matched.some((r) => r.meta.public);
  if (!auth.isAuthenticated && !isPublic) {
    return { name: 'login', query: { next: to.fullPath } };
  }
  if (auth.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    return { name: 'home' };
  }
  const allowedRoles = to.meta.roles as string[] | undefined;
  if (allowedRoles && auth.role && !allowedRoles.includes(auth.role)) {
    return { name: 'home' };
  }
  return true;
});

function routeHome(_to: unknown): { name: string } {
  void _to;
  const auth = useAuthStore();
  if (auth.role === 'doctor') return { name: 'doctor-home' };
  return { name: 'citizen-home' };
}
