const maria = require('mysql');

const conn = maria.createConnection({
    host: '192.168.0.95',
    port : 3306,
    user : 'yeni2015',
    password: 'yeni2015',
    database: 'i++'
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