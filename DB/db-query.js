const { Pool } = require('pg');

// dotenv.config();
 const connectionString = `postgres://ehhlotlgbykxhl:58bf0c2052b0355eb632a24c1be0837bf227d32f43bb18ec369409aef5be5636@ec2-174-129-18-210.compute-1.amazonaws.com:5432/dc0gubgpvestop?ssl=true`



const pool = new Pool({
  connectionString:connectionString
});

/*const pool = new Pool({
  user: 'ehhlotlgbykxhl',
  host: 'ec2-174-129-18-210.compute-1.amazonaws.com',
  database: 'dc0gubgpvestop',
  password: '58bf0c2052b0355eb632a24c1be0837bf227d32f43bb18ec369409aef5be5636',
  port: 5432,
})
*/

/*pool.on('connect', () => {
  console.log('connected to the db');
});
*/
// 



//CREATING TABLES

  const UserTableQuery = ` 
  CREATE TABLE IF NOT EXISTS users (
      userid    SERIAL,
      first_name  VARCHAR(250)     NOT NULL,
      last_name   VARCHAR(250)     NOT NULL,
      email       VARCHAR(250)  NOT NULL,
      password    VARCHAR(250)  NOT NULL,     
      role   VARCHAR(250)  NOT NULL,
      PRIMARY KEY (userid)
  ); `


  const LenderTableQuery = ` 
  CREATE TABLE IF NOT EXISTS lenders (
    lenderid       SERIAL,
    first_name  VARCHAR(250)     NOT NULL,
    last_name   VARCHAR(250)     NOT NULL,
    email       VARCHAR(250)  NOT NULL,
    userid        SERIAL,
    FOREIGN KEY (userid) REFERENCES users (userid),
    PRIMARY KEY (lenderid)
  ); `


  const LoanTableQuery = ` 
  CREATE TABLE IF NOT EXISTS loans (
  loanid        SERIAL,
  amount        INT  NOT NULL,
  status        VARCHAR(250),
  description   VARCHAR(250),
  createdOn     DATE      NOT NULL,
  userid        SERIAL,
  lenderid      SERIAL,
  PRIMARY KEY (loanid),
  FOREIGN KEY (lenderid) REFERENCES lenders (lenderid),
  FOREIGN KEY(userid) REFERENCES users (userid)

);`


  

 // database query
pool.query(UserTableQuery)
pool.query(LenderTableQuery)
pool.query(LoanTableQuery)



module.exports = {
 
  query(text, params){
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
    })
  }
}


