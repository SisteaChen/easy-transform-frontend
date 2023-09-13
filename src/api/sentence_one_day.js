import request from "@/utils/request";

export function getSentence(){
    return request({
        url: '/api/sentence/',
        method: 'get'
    })
}

