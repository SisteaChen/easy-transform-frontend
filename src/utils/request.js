import axios from 'axios'
import { Message } from "element-ui";

// 创建axios实例
const service = axios.create({
    baseURL : process.env.VUE_APP_SERVER_URL,
    // base是公告接口，url=base+request url
    timeout : 5 * 1000
    // ms
})
service.defaults.withCredentials = false  // 跨域访问，后端也要设置
service.interceptors.request.use(config =>{
        //携带token
        let token = localStorage.getItem('token');
        token && (config.headers.Authorization = "Bearer " + token);
        return config;
    }, error => {
        return Promise.reject(error);
    });
axios.defaults.validateStatus = status => {
    return /^(2|3)\d{2}$/.test(status);
};
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => { // 不能返回正常请求数据时对错误类型进行判断展示
        if (error && error.response){
            switch (error.response.status){
                case 400:
                    Message({
                        showClose:true,
                        message: error.response.data,
                        type: 'error',
                        duration: 2 * 1000,
                    })
                    break

                case 401: // 未验证
                    Message({
                        showClose:true,
                        message: error.response.data,
                        type: 'error',
                        duration: 2 * 1000,
                    })
                    break

                case 403: // 服务器已经理解请求，但是拒绝执行（可能是token过期）
                    localStorage.removeItem('token');
                    //跳转到登陆页面
                    Message({
                        showClose:true,
                        message: error.response.data,
                        type: 'error',
                        duration: 2 * 1000,
                    })
                    break

                case 404:
                    break

                case 408:
                    break
            }
            return Promise.reject(error)
        }
        else{
            //服务器崩了
            //客户端没有网
            if(!window.navigator.onLine){
                //断网处理
                return;
            }
            return Promise.reject(error)
        }
    }
)
export default service