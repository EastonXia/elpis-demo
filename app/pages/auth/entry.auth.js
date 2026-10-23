import saraBoot from '$saraBoot';
import auth from './auth.vue'

const routes = [{
  path: '/view/auth/login',
  component: () => import('./complex-view/login/login.vue')
}]

saraBoot(auth, { routes })