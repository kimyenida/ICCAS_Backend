const maria = require("mysql");

require("dotenv").config();

const conn = maria.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

conn.connect;

const queryreturn = (query) => {
  return new Promise(function (resolve, reject) {
    conn.query(String(query), function (error, results, fields) {
      if (error) throw error;
      resolve(results);
    });
  });
};

module.exports = { queryreturn };
