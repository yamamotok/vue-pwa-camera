import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import './style.css';
import App from './App.vue';
import Home from './components/Home.vue';
import Camera from './components/Camera.vue';
import Capture from './components/Capture.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/camera', name: 'Camera', component: Camera },
    { path: '/capture', name: 'Capture', component: Capture },
  ],
});

createApp(App).use(router).mount('#app');
