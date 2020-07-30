const dns = require("dns")

async function getIPAddress(url){
    url = await domainFromURL(url);
    return new Promise((resolve, reject) => {
        dns.lookup(url, (err, address, family) => {
            if(err) reject(err);
            resolve(address);
        });
    });
};
async function domainFromURL(url) {
    let match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        return await match[1]
    }
}

module.exports = getIPAddress






