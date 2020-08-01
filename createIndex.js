const client = require('./connection.js');
async function createIndex(name){
    client.indices.create({
        index: name,
        body:{
            "settings": {
                "analysis": {
                    "analyzer": {
                        "english_stop":{
                            "type":"standard",
                            "stopwords":"_english_"
                        },
                        "custom_analyzer":{
                            "type":"custom",
                            "tokenizer":"standard",
                            "char_filter":["html_strip"],
                            "filter":["lowercase","trim","my_stemmer"]
                        },
                        "url_analyzer":{
                            "type":"custom",
                            "tokenizer": "uax_url_email"
                        }
                    },
                    "filter": {
                        "my_stemmer":{
                            "type":"stemmer",
                            "name":"english"
                        }
                    }
                },
                "index": {
                    "number_of_shards": 1,
                    "number_of_replicas": 1
                }
            },
            "mappings": {
                "properties":{
                    "title":{
                        "type":"text",
                        "analyzer":"custom_analyzer"
                    },
                    "h":{
                        "type":"text",
                        "analyzer":"custom_analyzer"
                    },
                    "p":{
                        "type":"text",
                        "analyzer":"custom_analyzer"
                    },
                    "meta":{
                        "type":"text",
                        "analyzer":"custom_analyzer"
                    },
                    "href":{
                        "type":"text",
                        "analyzer":"url_analyzer"
                    },
                    "link":{
                        "type":"nested",
                        "properties":{
                            "link":{
                                "type":"text",
                                "analyzer":"url_analyzer"
                            },
                            "text":{
                                "type":"text",
                                "analyzer":"custom_analyzer"
                            }
                        }
                    },
                    "img":{
                        "type":"nested",
                        "properties":{
                            "link":{
                                "type":"text",
                                "analyzer":"url_analyzer"
                            },
                            "text":{
                                "type":"text",
                                "analyzer":"custom_analyzer"
                            },
                            "alt":{
                                "type":"text",
                                "analyzer":"custom_analyzer"
                            }
                        }
                    },
                    "table":{
                        "type":"nested",
                        "properties":{
                            "thead":{
                                "type":"text",
                                "analyzer":"custom_analyzer"
                            },
                            "tbody":{
                                "type":"text",
                                "analyzer":"custom_analyzer"
                            }
                        }
                    },
                    "list":{
                        "type":"text",
                        "analyzer":"custom_analyzer"
                    }
                }
            }
        }
    },function(err,resp,status) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("create",resp);
        }
    });
}

module.exports = createIndex
