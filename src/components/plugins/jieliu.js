// export function  jieliu(fn, wait,timeid,proxy,key) {
    // if (timeid) {
    //   return
    // }
    // proxy[key] = '343434'
    // timeid = setTimeout(()=>{
    //     fn()
    //     console.log('999');
    //     clearTimeout(timeid)
    //     proxy[key] = null
    // }, wait)
    
    // console.log(timeid,'tieid');
    // return timeid
    // return new Promise((resolve)=>{
    //     if(timeid) return
    //     timeid =  setTimeout(() => {
    //         fn()
    //         clearTimeout(timeid)
    //         resolve(timeid)
    //     }, wait);
    // })
  // }

  export function jieliu(fn, wait) {
   let timer = null
   return function() {
    if(timer) return

   timer = setTimeout(() => {
        fn()
        console.log('节流处理');
        timer = null
    }, wait);
   }
  }