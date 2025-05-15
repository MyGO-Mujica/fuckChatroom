<script setup>
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores' // 导入 userStore

const userStore = useUserStore()

const avatars = ref([
  { id: 1, nickname: '天使anno' },
  { id: 2, nickname: '天使soyo' },
  { id: 3, nickname: '天使乐奈' },
  { id: 4, nickname: '天使立希' },
  { id: 5, nickname: '天使灯' },
])

const selectedAvatar = ref(null)

const getAvatarUrl = (id) => {
  try {
    return new URL(`../../assets/avatar/${id}.jpg`, import.meta.url).href
  } catch (error) {
    console.error('获取头像 URL 失败:', error)
    return ''
  }
}

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

const saveSelectedAvatar = () => {
  if (selectedAvatar.value) {
    ElMessageBox.confirm(`你确定要使用头像：${selectedAvatar.value.nickname} 吗?`, '更换头像', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
      .then(() => {
        const avatarUrl = getAvatarUrl(selectedAvatar.value.id)
        userStore.updateUserPic({ user_pic: avatarUrl }) // 更新 userStore
        ElMessage({
          type: 'success',
          message: `已选择头像：${selectedAvatar.value.nickname}`,
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消更换',
        })
      })
  } else {
    ElMessage.warning('请先选择一个头像。')
  }
  console.log(userStore.user.user_pic)
}
</script>

<template>
  <div>
    <h2>选择你的头像</h2>
    <el-row :gutter="10" class="avatar-list">
      <el-col :span="6" v-for="avatar in avatars" :key="avatar.id">
        <div class="avatar-item" @click="selectAvatar(avatar)">
          <el-image
            :src="getAvatarUrl(avatar.id)"
            :alt="`头像 ${avatar.nickname}`"
            class="avatar-image"
            fit="cover"
            style="
              width: 80px;
              height: 80px;
              border-radius: 5px;
              border: 1px solid #ccc;
              cursor: pointer;
            "
          />
          <div
            v-if="selectedAvatar && selectedAvatar.id === avatar.id"
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.1);
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <el-icon><Check /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 20px">
      <p v-if="selectedAvatar">你选择了头像：{{ selectedAvatar.nickname }}</p>
      <el-button v-if="selectedAvatar" type="success" @click="saveSelectedAvatar"
        >保存头像</el-button
      >
    </div>
  </div>
</template>

<style scoped>
.avatar-list {
  margin-top: 20px;
}

.avatar-item {
  position: relative;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
}

.avatar-image {
  object-fit: cover;
}
</style>
