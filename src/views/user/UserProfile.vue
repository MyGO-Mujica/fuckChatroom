<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'

const formRef = ref()

// 是在使用仓库中数据的初始值 (无需响应式) 解构无问题
const {
  user: { username },
} = useUserStore()

const form = ref({
  username,
})
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
    </el-form>
  </page-container>
</template>
