import request from '@/utils/request'

export function videoUpload(data) {
    return request({
        url: '/api/modeldeal/',
        method: 'post',
        data:data,
    })
}