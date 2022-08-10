<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatat_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        class="login"
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">11</el-input>
          <!-- :prefix-icon="User" -->
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
          <!-- :prefix-icon="password" -->
        </el-form-item>
        <el-form-item>
          <div class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div><star-background /></div>
  </div>
</template>

<script>
import StarBackground from "./background.vue";
import { reactive, toRefs } from "@vue/reactivity";
import { getCurrentInstance } from "vue";
// import { User, password } from '@element-plus/icons-vue'
export default {
  setup(props, context) {
    console.log(props, context);
    let { proxy } = getCurrentInstance();
    let login = reactive({
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 9, message: "长度在 6 到 9 个字符", trigger: "blur" },
        ],
      },
      resetLoginForm() {
        proxy.$refs.loginFormRef.resetFields();
      },
      login() {
        proxy.$refs.loginFormRef.validate(async (vaild) => {
          if (!vaild) return;
          const { data: res } = await proxy.$http.post(
            "login",
            login.loginForm
          );
          if (res.meta.status !== 200) {
            //   this.$message.error('登陆失败')
          }
          // this.$message.success('登录成功')
          window.sessionStorage.setItem("token", res.data.token);
          proxy.$router.push("/home");
        });
      },
    });
    return { ...toRefs(login) };
  },
  components: { StarBackground },
};
</script>

<style  lang="less" scoped>
.login_container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #050608;
}

.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.avatat_box {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: #fff;
  padding: 15px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #eee;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
