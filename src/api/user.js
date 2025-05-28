import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, avatar }) =>
  request.post('/register', { username, password, avatar })
//登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/login', { username, password })

//获取用户的基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

//获取历史消息
export const getHistoryMessage = () => request.get('/message')
