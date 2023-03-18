import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './Home.vue';
import Upload from './Upload.vue';
Vue.use(VueRouter);
const router = new VueRouter({
	mode: "hash",
	routes: [{
		path: '/',
		component: Home,
	}, {
		path: '/upload',
		component: Upload
	}, {
		path: '*',
		redirect: '/'
	}]
});
export default router;