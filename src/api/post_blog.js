import request from "@/utils/request";

export function blogPost(blogData){
    return request({
        url: '/api/postes/',
        method: 'post',
        data: blogData
    })
}

