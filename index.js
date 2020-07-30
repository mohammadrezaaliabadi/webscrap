const Scrap = require("./scrap")
async function main() {
    const scrap = new Scrap("https://www.zoomit.ir/");
    await scrap.init();
    await scrap.apply(level = 1);
    await scrap.finish();
}
main();







