import { defineStore } from 'pinia';
import {getNav} from "../api";
import {RouteRecordRaw} from "vue-router";
import router from "../router";

interface MenuItem {
	id: number;
	parentId:number;
	name: string;
	icon: string;
	url: string;
	perm: string;
	children: MenuItem[];
}

export const usePermissStore = defineStore('permStore', {
	state: () => {
		return {
			perms: <string[]>[],
			menus: <MenuItem[]>[],
			routes: <RouteRecordRaw[]>[]
		};
	},
	actions: {
		async generateRoutes() {
			const res = await getNav();
			let menus: MenuItem[] = res.data.menuList;
			//保存用户所具有的的菜单权限
			this.perms = res.data.permList;
			this.menus = menus;
			//根据菜单生成路由
			const menuRoutes = generateMenuRoutes(menus);
			//生成首页路由
			const homeRoute: RouteRecordRaw = {
				path: '/', name: 'home', children: menuRoutes,
				component: () => import('../views/home.vue'),
			};
			this.routes.push(homeRoute);
			return this.routes;
		}
	}
});

const modules = import.meta.glob('../views/*.vue');
const menuRoutes: RouteRecordRaw[] = [];
//console.log(modules);
function generateMenuRoutes(items: MenuItem[]) {
	//const itemMap: Record<number, RouteRecordRaw> = {};
	for (const item of items) {
		if(item.children) {
			generateMenuRoutes(item.children);
		}else {
			const node: RouteRecordRaw = {
				path:item.url,
				name:item.url.substring(1),
				children: [],
				meta:{
					title: item.name,
					perm: item.perm
				},
				component: modules[`../views${item.url}.vue`]
			};
			menuRoutes.push(node);
		}
	}
	return menuRoutes;
}