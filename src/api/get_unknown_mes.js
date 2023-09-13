import request from "@/utils/request";

export function getUnknownMes(uid,params){
    return request({
        url: '/api/comments/?poster_uid=' + uid + '&is_known=false',
        method: 'get',
        params:params
    })
}
