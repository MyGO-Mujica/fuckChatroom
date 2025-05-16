<script setup>
import { SwitchButton, CaretBottom } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
//import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

// onMounted(() => {
//   userStore.getUser()
// })

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '退出登录', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      confirmButtonClass: 'el-button--danger', // 确认按钮使用危险样式
    })

    // 清除本地的数据 （user信息）
    userStore.setUser({})
    router.push('/login')
  }
}
</script>

<template>
  <!--
     el-menu 整个菜单组件
     :default-active="$route.path" 配置默认高亮的菜单项
      router    router选项开启， el-menu 的 index 就是点击跳转的路径
      -->
  <el-container class="layout-container">
    <el-container>
      <el-header>
        <div>
          <strong>欢迎来到科协聊天室</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示给用户，默认看到的 -->
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
}
</style>
