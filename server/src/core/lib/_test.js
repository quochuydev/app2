const _test = async (test) => {
  for(let fn in test){
    if(typeof test[fn] == 'function'){
      try{
        await test[fn]();
      } catch(e){
        console.log(e)
      }
    }
  }
}

module.exports = { _test }