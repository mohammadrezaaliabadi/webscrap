const client = require('./connection.js');

async function search(indexName,query){
    await client.search({
        index: indexName,
        body: query
    },function (error, response,status) {
        if (error){
            console.log("search error: "+error)
        }
        else {
            console.log("--- Response ---");
            console.log(response);
            console.log("--- Hits ---");
            response.hits.hits.forEach(function(hit){
                console.log(hit);
            })
        }
    });
}

(async() => {
    await search("elastic",{
        "query": {
            "multi_match": {
                "query": "elastic",
                "fields":["title","h","p"]
            }
        }
    });
})()
