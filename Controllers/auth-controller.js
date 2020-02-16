const pool = require ('../DB/db-query');
const Helper = require ('../Helper');
const expressJwt = require('express-jwt')
const jwt = require ('jsonwebtoken')




  async function createUser(req, res) { 

    if (!req.body.email || !req.body.password) {
      return res.status(400)
                  .json({
                    "status": "error",
                    "error": "Some values are missing"
                    
                  });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400)
                    .json({
                      "status": "error",
                        "error": "Please enter a valid email address"
                   });
    }

    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(
       first_name, last_name , email, password, role )
        VALUES($1, $2, $3, $4, $5)
        returning *`;
        const values = [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          hashPassword,
          req.body.role
    ];

    try {
      const { rows } = await pool.query(createQuery, values);
      const id = rows[0].userid
      const token = Helper.generateToken(id);
      return res.status(201)
                .json({  status: "success", 
                                 "data": {
                                  "message" : "User account successfully created",
                                  "token": token,
                                  "userid": id }
                                  });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400)
                  .json({ 
                    "status": "error",
                    "error": 'users with that EMAIL already exist' 
                  });
      }
      return res.status(400)
                  .json({ 
                    "status": "error",
                    "error": "Unable to create a user"
       
                  });
    }
  }

  async function signin(req, res) {
    if (!req.body.email || !req.body.password) {
      console.log(req.body)
      return res.status(400)
                  .json({
                     "status": "error",
                      "error": "Some values are missing"
                    });
      }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400)
                    .json({
                     "status": "error",
                      "error": "Enter a valid email passwword"
                    });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await pool.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400)
                    .json({
                     "status": "error",
                    "error": "The credentials you provided is incorrect"
                    });
      }
        if(!Helper.comparePassword(rows[0].password, req.body.password)) {
          return res.status(400)
                        .json({
                          "status": "error",
                          "error": "The password you provided did not match"
                        });
        }
        const id = rows[0].userid
        const firstName = rows[0].first_name
        const lastName =  rows[0].last_name
        console.log(firstName, lastName)
        const token = Helper.generateToken(id);
        return res.status(200)
                       .json({"token": token,"userId": id,"firstName": firstName,"lastName": lastName});
    } catch(error) {
      return res.status(400)
                    .json({ 
                    "status": "error",
                    "error": "Unable to signin user"
                  });
    }

  }

     const requireSignin = expressJwt({
      secret: "MY_SECRET_KEY",
      userProperty: 'auth'
    })


/*var secretCallback = function(req, payload, done){
  var issuer = payload.iss;
 
  data.getTenantByIdentifier(issuer, function(err, tenant){
    if (err) { return done(err); }
    if (!tenant) { return done(new Error('missing_secret')); }
 
    var secret = utilities.decrypt(tenant.secret);
    done(null, secret);
  });
};
 
app.get('/protected',
  jwt({secret: secretCallback}),
  function(req, res) {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
  });

*/
/*
const hasAuthorization = (req, res, next) => {
  
  const authorized = req.auth.userId == 6
  console.log(authorized)
  if (!(authorized)) {
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}*/



module.exports = { createUser, signin, requireSignin }

