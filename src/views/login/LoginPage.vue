<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import './LoginPage.css'
const isRegister = ref(false)
const form = ref()
// 整个表单的校验规则
// 1. 非空校验 required:true, message提示消息， trigger触发校验的时机 blur change
// 2. 长度校验 min：xx， max：xx
// 3. 正则校验 pattern： 正则规则  \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验 （校验函数）
//  validator: (rule, value, callback
// （1）rule 当前所校验规则相关的信息
// （2）value 所校验的表单元素目前的表单值
// （3）callback  无论成功还是失败都需要callback 回调
//    -callback（） 校验成功
//    -callback（new Error（错误信息））校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是 2-10位 的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是 6-15 位的非空字符', trigger: 'blur' },
  ],
}

const userStore = useUserStore()
const router = useRouter()
const showAvatarDialog = ref(false)
const images = ref([
  'https://i.pinimg.com/736x/88/4b/89/884b8919119c2e0e9aad2b7effe826e7.jpg',
  'https://i.pinimg.com/736x/3c/ab/76/3cab76029baf862a3254c413e47e2388.jpg',
  'https://i.pinimg.com/736x/33/32/fe/3332fe6cff6077a64da9a1f0484d31f0.jpg',
  'https://i.pinimg.com/736x/cf/f9/45/cff945a2037a39cb2ad69af32e41049b.jpg',
  'https://th.bing.com/th/id/R.d02e9de48a33d222cdfaacee3bec4487?rik=8hWrCKugi0MoyA&riu=http%3a%2f%2fpic.baike.soso.com%2fp%2f20130701%2f20130701155242-1344008658.jpg&ehk=nIyjWYv4Bs9x0apE1xUapStamOCDVYyoQ1v47QVeD0Q%3d&risl=&pid=ImgRaw&r=0',
  'https://i.pinimg.com/736x/a6/3b/37/a63b37c129f0beb7d77f4c3649f2b10b.jpg',
  'https://i.pinimg.com/736x/29/84/5f/29845f793554a10db4bf41015448fefe.jpg',
  'https://i.pinimg.com/736x/ba/a1/f8/baa1f8776a068ec66ba5b9da17d0b24f.jpg',
  'https://i.pinimg.com/736x/e0/12/3d/e0123d96ce6fc5ce8e27a21472b1d125.jpg',
  'https://i.pinimg.com/736x/76/6f/ac/766fac7b33219d8e7d1553e279e75697.jpg',
  'https://i.pinimg.com/736x/7e/4a/91/7e4a912ba71c286d4ebad2487f68f040.jpg',
  'https://i.pinimg.com/736x/7a/a3/83/7aa383e31d404db918e2f787d5c869c3.jpg',
  'https://i.pinimg.com/736x/22/df/fa/22dffa1cdf5e8ba349395a5cd4e534eb.jpg',
  'https://i.pinimg.com/736x/e6/d5/3e/e6d53ebb7ec8e61fe5bdea1cd7e43fe2.jpg',
  'https://i.pinimg.com/736x/3e/1c/68/3e1c689379e5094f854d4d21ca82c73e.jpg',
  'https://i.pinimg.com/736x/eb/f8/f2/ebf8f2cbc130784521559cda98eac7ff.jpg',
  'https://i.pinimg.com/736x/74/be/56/74be56cad2a14dcda871130f9a72e19c.jpg',
  'https://i.pinimg.com/736x/d0/8f/9e/d08f9e3f6409863ab2b279ba7f2d7a32.jpg',
  'https://i.pinimg.com/736x/e8/47/c6/e847c6b610b157c3fdfb5d3fa1bdf237.jpg',
  'https://i.pinimg.com/736x/de/1b/04/de1b046ba593432ba0e0328d69ce6cd4.jpg',
  'https://i.pinimg.com/736x/0c/34/81/0c34819bc634927c7d003361e25931fc.jpg',
  'https://i.pinimg.com/736x/1f/ce/9b/1fce9b699fd1dd4ba5e850d2e72aa8ba.jpg',
  'https://i.pinimg.com/736x/a1/6e/7a/a16e7acd602212509ac2d668501f466a.jpg',
  'https://i.pinimg.com/736x/f6/96/8b/f6968bd25c4d4fc650e81b82f059f62e.jpg',
  'https://i.pinimg.com/736x/17/fd/f7/17fdf710781a56da86966d6011582907.jpg',
  'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F29%2F20190829102057_qoahb.thumb.400_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1751098451&t=25b0798417d378a509438ab190728086',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejY4cjkzeTk5c3BoMmQzdGlhYWF6MzhqazY0cm96azdjMTMxMms4MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/TyiIUwlNKYmZhM2Whk/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczR1aWp3M3o0Zjdwd2wydmR1dnltbGFqNmUzZWlyaXUyMmoxcGZ5cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UYzNgRSTf9X1e/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl2NTRhMDVseHQ2MmVvdWFzOTU3djJtNHkxN3N0bXI2NHQ5d2E1aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/862A6X2sooSsw/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmE4dGg3aG94dzZoZGJhNWJkeXdmN2dpbmRmYWFmZ3g5cTJxYmc4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sNUWF7fAUP2q4/giphy.gif',
])

const formModel = ref({
  username: '',
  password: '',
  avatar: images.value[0],
})

//注册功能
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

// 登录功能
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  // 保存用户数据到 pinia
  userStore.setUser(res.data)
  userStore.setToken(res.msg)
  ElMessage.success('登录成功')
  router.push('/chat/chatRoom')
}

// 切换的时候，重置表单内容
watch(isRegister, (newVal) => {
  if (newVal) {
    // 切换到注册，重置所有字段
    formModel.value = {
      username: '',
      password: '',
      avatar: images.value[0],
    }
  } else {
    // 切换到登录，仅清空密码
    formModel.value.password = ''
    // 保留注册时的用户名
  }
})
</script>

<template>
  <!--
   1. 结构相关
   el-row 表示一行 ，一行分成24份
   el-col 表示列
   （1） :span="12"  代表在一行中 ， 占12份（50%）
   （2） :span="6" 表示在一行中 ， 占六份（25%）
   （3） :offset="3" 代表在一行中，左侧margin份数

   el -form 整个表单组件
   el-form-item 表单的一行 （一个表单域）
   el-input 表单元素 （输入框）

   2. 校验相关
    （1）el-form => ：model="ruleForm"      绑定的整个form的数据对象 {xxx, xxx, xxx}
    （2）el-form => :rules="rules"          绑定的整个rules规则对象  {xxx, xxx, xxx}
    （3）表单元素 => v-model="ruleForm.xxx"  给表单元素，绑定form的子属性
    （4）el-form-item prop配置生效的事哪个校验规则 （和rules中的字段要对应）
-->
  <el-row class="login-page">
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        @submit.prevent="register"
      >
        <el-form-item>
          <div class="form-header">
            <div class="chatroom-title-wrapper">
              <h1 class="chatroom-title">KeXie Register</h1>
            </div>
            <div class="avatar-wrapper" @click="showAvatarDialog = true">
              <img :src="formModel.avatar" class="selected-avatar" />
              <span class="change-tip">点击更换头像</span>
            </div>
          </div>
        </el-form-item>
        <el-dialog v-model="showAvatarDialog" title="选择头像" width="400px" center>
          <div class="avatar-list">
            <img
              v-for="(img, index) in images"
              :key="index"
              :src="img"
              class="avatar"
              @click="
                () => {
                  formModel.avatar = img
                  showAvatarDialog = false
                }
              "
            />
          </div>
        </el-dialog>

        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <button class="animated-button">
            <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span class="text">注册</span>
            <span class="circle"></span>
            <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        @submit.prevent="login"
        v-else
      >
        <el-form-item>
          <div class="form-header">
            <div class="chatroom-title-wrapper">
              <h1 class="chatroom-title">KeXie ChatRoom</h1>
            </div>
            <!-- 加一个空的头像占位元素，但不显示 -->
            <div class="avatar-wrapper" style="visibility: hidden">
              <img :src="formModel.avatar" class="selected-avatar" />
              <span class="change-tip">点击更换头像</span>
            </div>
          </div>
        </el-form-item>
        <el-dialog v-model="showAvatarDialog" title="选择头像" width="400px" center>
          <div class="avatar-list">
            <img
              v-for="(img, index) in images"
              :key="index"
              :src="img"
              class="avatar"
              @click="
                () => {
                  formModel.avatar = img
                  showAvatarDialog = false
                }
              "
            />
          </div>
        </el-dialog>

        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <button class="animated-button">
            <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span class="text">登录</span>
            <span class="circle"></span>
            <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12"></el-col>
  </el-row>
</template>
