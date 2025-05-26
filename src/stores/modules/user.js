import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() //请求获取数据
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      user,
      getUser,
      setUser,
    }
  },
  {
    persist: true,
  },
)
