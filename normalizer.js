async function linkNormalizer(links, baseUrl) {
    this.rootRegex = /^\/.*/g;
    // todo refactor
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
    await links.forEach(item => {
        if (item["link"]!==""&&item["link"]!== null){
            if (item["link"][0]==="/") {
                item["link"] = baseUrl + item["link"]
            }
        }
    })
}


module.exports = linkNormalizer