<script setup>
import { userLoginService } from '@/api/user'
import { User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

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
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' },
  ],
}

const userStore = useUserStore()
const router = useRouter()
const showAvatarDialog = ref(false)
const images = ref([
  'https://api.dicebear.com/7.x/bottts/svg?seed=a1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=a2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=a3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=a4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=a5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=a6',
  'https://api.dicebear.com/7.x/bottts/svg?seed=alpha',
  'https://api.dicebear.com/7.x/bottts/svg?seed=bravo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=charlie',
  'https://api.dicebear.com/7.x/bottts/svg?seed=delta',
  'https://api.dicebear.com/7.x/bottts/svg?seed=echo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=foxtrot',
  'https://api.dicebear.com/7.x/bottts/svg?seed=golf',
  'https://api.dicebear.com/7.x/bottts/svg?seed=hotel',
  'https://api.dicebear.com/7.x/bottts/svg?seed=india',
])

const formModel = ref({
  username: '',
  avatar: images.value[0],
})
console.log(formModel)
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}
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
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="4" class="form">
      <!-- 登录相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off">
        <el-form-item>
          <div class="form-header">
            <!-- 新增这个父容器 -->
            <div class="chatroom-title-wrapper">
              <h1 class="chatroom-title">KeXie ChatRoom</h1>
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
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: url('@/assets/loginBg.jpg') no-repeat 0%;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
.form-header {
  display: flex;
  align-items: center; // 垂直居中
  justify-content: space-between; // 两端对齐
  gap: 1px; // 元素间距
  width: 100%;

  .chatroom-title-wrapper {
    flex: 1; // 标题部分占据剩余空间
    text-align: left; // 标题左对齐
  }

  .chatroom-title {
    font-size: 32px;
    font-weight: 700;
    color: #409eff;
    margin: 0;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: relative;
  }
}
.chatroom-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 75%;
  height: 4px;
  background: linear-gradient(to right, #409eff, #67c23a);
  border-radius: 2px;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  .selected-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #87bddd;
  }
  .selected-avatar:hover {
    border: 2px solid#409eff;
  }
  .change-tip {
    color: #87bddd;
    font-size: 14px;
  }
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: 0.3s;
  }

  .avatar:hover {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.6);
  }
}
</style>
