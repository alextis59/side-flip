function test(){
    throw new Error("test");
}

async function run(){
    try{
        await test();
    }catch(err){
        console.log("error caught");
    }
}
  

run();