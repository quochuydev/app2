const _test = async (test) => {
  if(typeof test == 'function'){
    try{
      await test();
    } catch(e){
      console.log(e)
    }
  }
  if(typeof test == 'object'){
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
}

module.exports = { _test }