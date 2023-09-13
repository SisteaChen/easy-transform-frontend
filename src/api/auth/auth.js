import request from '@/utils/request'

export function userRegister(userDTO) {
    return request({
        url: '/api/users/',
        method: 'post',
        data: userDTO
    })
}

export function send_SMS(phoneNum) {
    return request({
        url: '/api/verification/smscode/' + phoneNum,
        method: 'get',
    })
}

export function userLogin(userData) {
    return request({
        url: '/api/login/',
        method: 'post',
        data: userData
    })
}

export function get_oss(type) {
    return request({
        url: '/api/verification/oss/' + type + '/',
        method: 'get',
    })
}

export function get_userinfo() {
    return request({
        url: '/api/user/',
        method: 'get',
    })
}


export function change_back(picUrl) {
    return request({
        url: '/api/user/',
        method: 'put',
        data : picUrl
    })
}
export function change_profile(picUrl) {
    return request({
        url: '/api/user/',
        method: 'put',
        data : picUrl
    })
}
export function change_sign(sign) {
    return request({
        url: '/api/user/',
        method: 'put',
        data : sign
    })
}

