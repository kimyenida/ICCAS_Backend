const maria = require('mysql');

const conn = maria.createConnection({
    host: '',
    port : 3306,
    user : '',
    password: '',
    database: ''
});

conn.connect;

const queryreturn = (query) => {
    return new Promise(function(resolve,reject){
        conn.query(String(query),function(error,results,fields){
            if(error) throw error;
            resolve(results); 
        })
    })
}

module.exports = {queryreturn};