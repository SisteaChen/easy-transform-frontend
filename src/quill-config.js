import axios from "axios";
import {get_oss} from "@/api/auth/auth";

let get_suffix = function(filename){
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
        suffix = filename.substring(pos)
    }
    return suffix
}

let random_string = function(len){
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

const uploadConfig = {
    name: 'img',  // 必填参数 文件的参数名
    accept: 'image/png, image/jpg'  // 可选 可上传的图片格式
};

const handlers = {
    image: function image() {
        let fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                let pro = new Promise((resolve, rej) => {
                    let res = JSON.parse(localStorage.getItem('sign'))
                    let timestamp = Date.parse(new Date()) / 1000
                    if (res && timestamp + 3 < res.expire) {
                        resolve(res) //避免服务器压力过大
                    } else {
                        get_oss(2).then(res => {
                            localStorage.setItem('sign', JSON.stringify(res))
                            resolve(res)
                        }).catch((err) => {
                            if (err.response && err.response.data) {
                                this.$Notice.error({
                                    title: '获取oss签名错误',
                                    desc: JSON.stringify(err.response.data)
                                });
                            } else {
                                this.$Notice.error({
                                    title: '获取oss签名错误',
                                    desc: "未知错误"
                                });
                            }
                            rej(err)
                        })
                    }
                })
                pro.then(data => {
                    let ossData = new FormData()
                    let file = fileInput.files[0];
                    ossData.append('name', file.name)
                    let filename = file.name
                    let keyValue = data.dir + random_string(20) + get_suffix(filename)//之后考虑加入uid
                    ossData.append('key', keyValue)
                    ossData.append('policy', data.policy)
                    ossData.append('OSSAccessKeyId', data.accessid)
                    ossData.append('success_action_status', 200)
                    ossData.append('signature', data.signature)
                    ossData.append('file', file, file.name)
                    axios.post(data.host, ossData, {
                        headers: {'Content-Type': 'multipart/form-data'},
                    })
                        .then(res => {
                            if (res.status === 200) {
                                sessionStorage['blog_pic'] = data.host + '/' + keyValue
                                alert('图片上传成功')
                                file.onSuccess(res)
                            } else {
                                file.onError(res)
                            }
                        }).catch(error => {
                        this.$Notice.error({
                            title: '上传到oss服务器时发生错误',
                            desc: "未知错误"
                        });
                        file.onError(error)
                    })
                })
            },);
            this.container.appendChild(fileInput);
        }
        fileInput.click();
    }
}


export default {
    debug: 'info',
    modules: {
        toolbar: {
            container:[
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['code-block','image']
            ],
            handlers: handlers  // 事件重写
        }
    },
    placeholder : 'Write your blog',
    readOnly: false,
    theme: 'snow'
}