export function  antiShake(fn, wait,timeid) {
    if (timeid !== null) {
      clearTimeout(timeid)
    }
    timeid = setTimeout(()=>{
        fn()
        console.log('防抖');
    }, wait)
    
    return timeid
  }