const _test = (test) => {
  for(let fn in test){
    if(typeof test[fn] == 'function'){
      try{
        test[fn]();
      } catch(e){
        console.log(e)
      }
    }
  }
}

module.exports = { _test }