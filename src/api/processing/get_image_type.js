import request from "@/utils/request";

export function getImageType(){
    return request({
        url: '/api/models/?mtype=image',
        method: 'get',
    })
}
