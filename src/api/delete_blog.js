import request from "@/utils/request";

export function deleteBlog(blogid){
    return request({
        url: '/api/postes/' + blogid,
        method: 'delete',
    })
}
