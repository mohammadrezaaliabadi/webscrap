const puppeteer = require("puppeteer"), fs = require("fs");
const linkNormalizer = require("./normalizer")
const getIPAddress = require("./getIPAddress")
const client = require('./connection.js');


class Scrap {
    constructor(baseUrl ,indexName, normalizer = {
                    linkNormalizer: linkNormalizer
                }
    ) {
        this.indexName= indexName;
        this.normalizer = normalizer;
        this.baseUrl = baseUrl;
        this.queueLinks = []
        this.queueVisit = []
    }

    async init(blockList) {
        try {
            this.blockList = blockList
            this.browser = await puppeteer.launch({ignoreHTTPSErrors: true, acceptInsecureCerts: true, args: ['--proxy-bypass-list=*', '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process', '--ignore-certificate-errors', '--ignore-certificate-errors-spki-list', '--enable-features=NetworkService']});
            this.mainPage = await this.browser.newPage();
            const r = this.blockList.find(value => value== getIPAddress(this.baseUrl))
            if (r!=undefined){
                throw new Error(`Ip:${r} is blocked for uri: ${this.baseUrl}`)
            }
            await this.mainPage.goto(this.baseUrl)
            await this.insert(await this.evaluate(this.mainPage))
        } catch (e) {
            console.log(e.message)
        }
    }

    async apply(level = 2) {
        if (level === 0) {
            return;
        } else {
            let temp = await Array.from(this.queueLinks)
            this.queueLinks = [];
            await this.try(temp)
            await this.apply(--level)
        }
    }

    async try(queueLinks) {
        try {
            let page;
            let link;
            for (let i = 0; i < queueLinks.length; i++) {
                link = queueLinks.pop();
                if (this.queueVisit.find(item => item === link)) {
                } else {
                    page = await this.browser.newPage();
                    this.queueVisit.push(link)
                    const r = this.blockList.find(value => value== getIPAddress(link))
                    if (r!=undefined){
                        console.log(`Ip:${r} is blocked for uri: ${link}`)
                    }else {
                        await page.goto(link).catch(e=> {
                            console.log(`Class ${Scrap.name}, function try, error: ${e.message}`)
                        })
                        await this.insert(await this.evaluate(this.mainPage))
                        await page.close()
                    }
                }
            }

        } catch (e) {
            console.log(`Class ${Scrap.name}, function try, error: ${e.message}`)
        }
    }

    async evaluate(page) {
        try {
            console.log(page._target._targetInfo.url)
            const ob = await page.evaluate(async () => {
                const ob = {}
                ob["href"] = window.location.href
                if (await document.querySelector("title")) {
                    ob["title"] = await document.querySelector("title").innerText.trim()
                }
                ob["h"] = await Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map(el => el.innerText.trim())
                ob["p"] = await Array.from(document.querySelectorAll("p")).map(el => el.innerText.trim())
                ob["meta"] = await Array.from(document.querySelectorAll("meta")).map(el => {
                    const arr = []
                    for (let i = 0; i < el.attributes.length; i++) {
                        arr.push([el.attributes[i].nodeName, el.attributes[i].nodeValue]);
                    }
                    return arr;
                })
                ob["link"] = await Array.from(document.querySelectorAll("a")).map(el => {
                    const temp = {}
                    temp["link"] = el.getAttribute("href")
                    temp["text"] = el.innerText.trim()
                    return temp;
                })
                ob["img"] = await Array.from(document.querySelectorAll("img")).map(el => {
                    const temp = {}
                    temp["link"] = el.getAttribute("src")
                    temp["alt"] = el.getAttribute("alt")
                    temp["text"] = el.innerText.trim()
                    return temp;
                })
                ob["table"] = await Array.from(document.querySelectorAll("table")).map(el => {
                    let temp = {}
                    if (document.querySelector("thead")) {
                        temp["thead"] = Array.from(document.querySelector("thead").querySelectorAll("tr")).map(tr => Array.from(tr.querySelectorAll("td,th")).map(td => td.innerText.trim()))
                    }
                    temp["tbody"] = Array.from(document.querySelector("tbody").querySelectorAll("tr")).map(tr => Array.from(tr.querySelectorAll("td,th")).map(td => td.innerText.trim()))
                    return temp

                })

                ob["list"] = await Array.from(document.querySelectorAll("ul,ol")).map(el => Array.from(document.querySelectorAll("li")).map(li => li.innerText.trim()))
                return ob;
            });
            await this.normalizer.linkNormalizer(ob["img"],this.baseUrl)
            await this.normalizer.linkNormalizer(ob["link"], this.baseUrl)
            ob["link"].forEach(item => {
                if (item["link"] !== "" && item["link"] !== null) {
                    if (item["link"][0] === "h") {
                        this.queueLinks.push(item["link"])
                    }
                }
            })
            return ob;
        } catch (e) {
            console.log(`Class ${Scrap.name}, function evaluate, error: ${e.message}`)
        }
    }

    async insert(ob){
        await client.index({
            index: this.indexName,
            body: ob
        },function(err,resp,status) {
            console.log(resp);
        });
    }

    async writeToFile(){
        await fs.writeFileSync("file.json", JSON.stringify(this.scrapOb), "utf8", err => {
            if (err) return console.log(`Class ${Scrap.name}, function finish, error: ${err.message}`);
        })
    }

    async finish() {
        await this.browser.close()
    }
}

module.exports = Scrap

