import request from "@/utils/request";

export function post_Comment(mes){
    return request({
        url: '/api/comments/',
        method: 'post',
        data: mes
    })
}
