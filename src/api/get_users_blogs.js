import request from "@/utils/request";

export function getUsersBlogs(uid, params){
    return request({
        url: '/api/postes/?uid=' + uid,
        method: 'get',
        params: params
    })
}
