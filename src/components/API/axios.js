import axios from "axios"
// import nprogress from 'nprogress'
// import 'nprogress/nprogress.css'
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
//   nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
//   nprogress.done()
  return config
})
export default {
 get(url, params){
    return new Promise((resolve, reject) =>{ 
    axios.get(url, {params: params}).then(res => {resolve(res);}).catch(err =>{ reject(err.data) })    
    });
},
post(url, params) {
    return new Promise((resolve, reject) => {   
    axios.post(url, QS.stringify(params))    
    .then(res => {  
        console.log(QS.stringify(params)+'@@@@@@@@@@@@@@@@@@@@@@@');  
    resolve(res);  
    }).catch(err =>{reject(err.data)})
    })
    },
put(url, params) {
    return new Promise((resolve, reject) => {   
    axios.put(url, QS.stringify(params))    
    .then(res => {    
    resolve(res);    
    }).catch(err =>{reject(err.data)})
    })
    },
delete(url, params) {
    return new Promise((resolve, reject) => {   
        axios.delete(url, QS.stringify(params))    
    .then(res => {    
    resolve(res);    
    }).catch(err =>{reject(err.data)})
    })
    }
}
