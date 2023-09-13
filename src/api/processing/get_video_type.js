import request from "@/utils/request";

export function getVideoType(){
    return request({
        url: '/api/models/?mtype=video',
        method: 'get',
    })
}
