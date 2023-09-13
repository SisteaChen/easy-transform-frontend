import request from "@/utils/request";

export function getKnownMes(uid,params){
    return request({
        url: '/api/comments/?poster_uid=' + uid + '&is_known=true',
        method: 'get',
        params:params
    })
}
