const fs = require("fs");
async function readFile(){
    return await fs.readFileSync("file.json","utf8",async (err, data) =>{
        if (err) console.log(err);
        return JSON.parse(data)
    })
}

async function readBlockList(){
    return await fs.readFileSync("blocklist.json","utf8",async (err, data) =>{
        if (err) console.log(err);
        return await JSON.parse(data);
    })
}

async function main(){
    const bl = await readFile();
    console.log(bl)
}
main()

