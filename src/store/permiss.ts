import { defineStore } from 'pinia';

export const usePermissStore = defineStore('permStore', {
	state: () => {
		return {
			perms: <string[]>[]
		};
	},
	actions: {
		setPerms(val: string[]) {
			this.perms = val;
		}
	}
});
