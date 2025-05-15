import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// export const userRegisterService = ({ username, password, repassword, avatarFile }) => {
//   const formData = new FormData();
//   formData.append('username', username);
//   formData.append('password', password);
//   formData.append('repassword', repassword);
//   if (avatarFile) {
//     formData.append('avatar', avatarFile);
//   }
//   return request.post('/api/reg', formData);
// }

//登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

//获取用户的基本信息
export const userGetInfoService = () => request.get('my/userinfo')
