import request from "@/utils/request";

export function getBlogs(params){
    return request({
        url: '/api/postes/',
        method: 'get',
        params: params
    })
}
