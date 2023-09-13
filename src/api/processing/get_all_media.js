import request from "@/utils/request";

export function getAllMedia(){
    return request({
        url: '/api/modeldeal/',
        method: 'get',
    })
}
