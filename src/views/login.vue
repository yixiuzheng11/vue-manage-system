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
          <!-- <div class="login-code">
            <img class="login-code-img" :src="captchaBase64Image" @click="getCaptcha" alt="图形验证码">
          </div>-->
        </el-form-item>
        <el-form-item prop="captchaCode" :inline="true">
          <img class="login-code-img" :src="captchaBase64Image" @click="getCaptchaCode" alt="图形验证码">
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
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { getCaptcha, doLogin } from '../api/login';

interface LoginInfo {
  userName: string;
  password: string;
  captchaCode:string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
  userName: 'admin',
  password: '123123',
  captchaCode: ''
});

const captchaBase64Image = ref();
getCaptchaCode();
function getCaptchaCode() {
  try {
    getCaptcha().then(res => {
      var respData = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data,
                                                                                      byte) => data + String.fromCharCode(byte), ''));
      captchaBase64Image.value = respData;
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
      // ElMessage.success('登录成功');
      // localStorage.setItem('ms_username', param.userName);
      // const keys = permiss.defaultList[param.userName == 'admin' ? 'admin' : 'user'];
      // permiss.handleSet(keys);
      // localStorage.setItem('ms_keys', JSON.stringify(keys));
      // router.push('/');
      doLogin(param).then(res => {
        let { code, data, msg } = res.data;
        if(code=='SUCCESS') {
          //console.log(res);
          ElMessage.success('登录成功');
          localStorage.setItem('ms_username', param.userName);
          const keys = permiss.defaultList[param.userName == 'admin' ? 'admin' : 'user'];
          permiss.handleSet(keys);
          localStorage.setItem('ms_keys', JSON.stringify(keys));
          router.push('/');
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
