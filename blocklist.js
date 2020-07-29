const puppeteer = require("puppeteer"), fs = require("fs");
const linkNormalizer = require("./normalizer")

class BlockList{
    constructor() {
    }

    async init(){
        try {
            this.browser = await puppeteer.launch({ignoreHTTPSErrors: true, acceptInsecureCerts: true, args: ['--proxy-bypass-list=*', '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process', '--ignore-certificate-errors', '--ignore-certificate-errors-spki-list', '--enable-features=NetworkService']});
            this.page = await this.browser.newPage();
            await this.page.goto("http://www.blocklist.de/en/export.html")
            console.log(await this.page)
            this.arrLink = await this.page.evaluate(async ()=>{
                return await Array.from(document.querySelectorAll("br + strong a")).map(el=>el.getAttribute("href"))

            })
        } catch (e) {
            console.log(e.message)
        }
    }
    async getListWithURL(url){
        await this.page.goto(url,{timeout: 0})
        return await this.page.evaluate(async ()=>{
            return await document.querySelector("pre").innerText.split("\n");
        })
    }

    async fetch(n){
        this.ob = {};
        for (let i=0 ;i<n & i<this.arrLink.length;i++) {
            this.ob[this.arrLink[i]] = await this.getListWithURL(this.arrLink[i]);

        }
        return this.ob;
    }

    async close(){
        this.browser.close()
        await fs.writeFileSync("blockList.json", JSON.stringify(this.ob), "utf8", err => {
            if (err) return console.log(`Class ${Scrap.name}, function finish, error: ${err.message}`);
        })
    }

}
async function fetch() {
    const bl = new BlockList();
    await bl.init()
    let fe = await bl.fetch(2);
    console.log(fe)
    await bl.close()
}

fetch()

