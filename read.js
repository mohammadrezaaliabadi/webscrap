const fs = require("fs");
function read(){
    fs.readFile("file.json","utf8",async (err, data) =>{
        if (err) console.log(err);
        ob = JSON.parse(data)
        console.log(ob.length)
    })
}
read()