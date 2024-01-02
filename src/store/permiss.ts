import { defineStore } from 'pinia';

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
			menus: <MenuItem[]>[]
		};
	},
	actions: {
		setPerms(val: string[]) {
			this.perms = val;
		},
		setMenus(val: MenuItem[]) {
			this.menus = val;
		}
	}
});
