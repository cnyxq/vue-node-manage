<template>
  <div class="register">
    <section class="form_container">
      <span class="title">在线财务管理系统</span>
      <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="100px" class="registerForm">
        <el-form-item label="用户名" prop="name">
          <el-input type="text" v-model="registerUser.name" placeholder="请输入用户名"></el-input>
        </el-form-item>  
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="registerUser.password2" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="registerUser.identity" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (value.length < 2) {
        callback(new Error('用户名的长度在2到15个字符之间'))
      } else if (value.length > 15) {
        callback(new Error('用户名的长度在2到15个字符之间'))
      } else {
        callback()
      }
    }
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
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerUser.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        identity: ''
      },
      options: [{
        value: 'manager',
        label: '管理员'
      }, {
        value: 'employee',
        label: '员工'
      }],
      rules: {
        name: [
          {validator: validateName, trigger: 'blur'}
        ],
        email: [
          {validator: validateEmail, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        password2: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/api/users/register', this.registerUser)
            .then(res => {
              if (res) {
                // 注册成功
                this.$message({
                  message: '账号注册成功！',
                  type: 'success'
                })
              }
            })
          this.$router.push('/login')  
        }
      })
    }
  }
}
</script>

<style scoped>
.register {
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
.form_container .registerForm {
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
</style>