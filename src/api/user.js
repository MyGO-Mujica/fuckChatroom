import request from '@/utils/request'

//登录接口
export const userLoginService = ({ username, avatar }) =>
  request.post('/api/login', { username, avatar })

//获取用户的基本信息
export const userGetInfoService = () => request.get('my/userinfo')
