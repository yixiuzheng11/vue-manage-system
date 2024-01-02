<template>
  <div class="login-wrap">
    <div class="ms-login">
      <!-- <div class="ms-title">后台管理系统</div> -->
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="userName">
          <el-input v-model="param.userName" placeholder="userName">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captchaCode" :inline="true">
          <el-input v-model="param.captchaCode" placeholder="验证码">
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captchaImage" :inline="true">
          <el-input v-model="param.captchaUuid" v-bind:type="'hidden'"/>
          <img class="login-code-img" :src="captchaImage" @click="getCaptchaImage" alt="图形验证码">
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, createHydrationRenderer, onMounted } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import {RouteRecordRaw, useRouter} from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import {getCaptcha, doLogin, LoginParam} from '../api/login';
import {getNav} from "../api";

const router = useRouter();
const param = reactive<LoginParam>({
  userName: 'admin',
  password: '123123',
  captchaCode: '',
  captchaUuid: ''
});

const captchaImage = ref();
getCaptchaImage();
function getCaptchaImage() {
  try {
    getCaptcha().then(res => {
      //const respData = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      captchaImage.value = res.data.captchaImage;
      param.captchaUuid = res.data.captchaUuid;
    });
  } catch (e) {
    console.log(e);
  }
}

const rules: FormRules = {
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      doLogin(param).then(res => {
        let { code, data, msg } = res;
        if(code === 'SUCCESS') {
          ElMessage.success('登录成功');
          localStorage.setItem('token', data);
          //查询菜单，生成路由
          getMenuRoute();
        }else {
          ElMessage.error('账号密码或验证码输入错误');
        }
      });
    } else {
      ElMessage.error('登录失败');
      return false;
    }
  });
};

interface MenuItem {
  id: number;
  parentId:number;
  name: string;
  icon: string;
  url: string;
  perm: string;
  children: MenuItem[];
}

//查询菜单
function getMenuRoute() {
  getNav().then(res => {
    console.log(JSON.stringify(res));
    let items: MenuItem[] = res.data.menuList;
    //保存用户所具有的的菜单权限
    const permStore = usePermissStore();
    permStore.setPerms(res.data.permList);
    //console.log("ms_perms-----", res.data.permList);
    //根据菜单生成路由
    const menuRoutes = generateRoutes(items);
    //生成首页路由
    const homeRoute: RouteRecordRaw = { path:'/', name:'home', children: menuRoutes,
      component: () => import('../views/home.vue'),
    };
    router.addRoute(homeRoute);
    //跳转到首页
    router.push("/");
  });
};

const modules = import.meta.glob('../views/*.vue')
function generateRoutes(items: MenuItem[]) {
  //const itemMap: Record<number, RouteRecordRaw> = {};
  const menuRoutes: RouteRecordRaw[] = [];
  for (const item of items) {
    if(item.children) {
      generateRoutes(item.children);
    }else {
      const node: RouteRecordRaw = {
        path:item.url,
        name:item.url.substring(1) ,
        children: [],
        meta:{
          title: item.name,
          perm: item.perm
        }
      };
      node.component = modules['../views' + item.url + '.vue']
      menuRoutes.push(node);
    }
  }
  return menuRoutes;
}

const tags = useTagsStore();
tags.clearTags();

</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.login-code-img {
  cursor: pointer;
  height: 60px;
  width:140px;
}
</style>
