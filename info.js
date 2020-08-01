const client = require('./connection.js');

(async () =>{
    await client.cluster.health({},function(err,resp,status) {
        console.log("-- Client Health --",resp);
    });
})();
