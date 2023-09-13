import request from "@/utils/request";

export function gotoBlog(blogid){
    return request({
        url: '/api/postes/' + blogid,
        method: 'get',
    })
}
