<template>
  <div class="login">
    <section class="form_container">
      <span class="title">在线后台管理系统</span>
      <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在<router-link to='/register'>注册</router-link> </p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'login',
  data () {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        const patt = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g
        if (patt.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱'))
        }
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码的长度在6到15个字符之间'))
      } else if (value.length > 15) {
        callback(new Error('密码的长度在6到15个字符之间'))
      } else {
        callback()
      }
    }
    return {
      loginUser: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {validator: validateEmail, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/api/users/login', this.loginUser)
            .then(res => {
              const { token } = res.data
              localStorage.setItem('eleToken', token)
              // 解析token
              const decode = jwt_decode(token)
              // 将解析结果存储到vuex
              this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
              this.$store.dispatch('setUser', decode)
              // 登录成功
              this.$message({
                message: '登录成功！',
                type: 'success'
              })
              this.$router.push('/index')
            })
        }
      })
    },
    isEmpty (value) {
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    }
  }
}
</script>

<style scoped>
.login {
  position: relative;
  height: 100vh;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.form_container .loginForm {
  padding: 25px;
  border-radius: 5px;
  background: #fff;
}
.form_container .title {
  display: inline-block;
  width: 100%;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
}
.form_container .submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>