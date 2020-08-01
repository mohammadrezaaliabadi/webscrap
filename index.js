const Scrap = require("./scrap"),createIndex = require("./createIndex") ;
const BlockList = require("./blocklist");
(async ()=> {
    const nameIndex = "zommit";
    //await createIndex(nameIndex)
    const scrap = new Scrap("https://www.zoomit.ir/",nameIndex);
    let bl = new BlockList();
    await bl.init()
    await scrap.init(await bl.fetch(2));
    await bl.close()
    await scrap.apply(level = 1);
    await scrap.finish();
})()








