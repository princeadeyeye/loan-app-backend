const pool = require ('../DB/db-query');

async function createLender (req, res) {
    const createQuery = `
    INSERT INTO
      lenders(
        first_name, 
        last_name,
        email,
        userid  
        )
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.userid,
    ];

    try {
      const { rows } = await pool.query(createQuery, values);
        return res.status(201)
                  .json({
                    "status": "success",
                    "data": {
                    "message": "Lender successfully created",
                    "lenderId": rows[0].lenderid
                    }
                    });
    } catch(error) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to create lender"
                  });
              }
           }



  async function listUsers(req, res) {
    const usersQ= 'SELECT * FROM users ORDER BY userid ASC'; 
    try {
      const { rows } = await pool.query(usersQ);
      if (!rows) {
        return res.status(404)
                        .json({
                      "status": "error",
                        "error": "Users not found"
                  });
      }
      rows.password = undefined
      return res.status(200)
                    .json({
                      "status": "success",
                      "data": rows
                    });
    } catch(error) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to get users"
                  });
    }
  }



  async function getUser(req, res) {
    const userQ = `SELECT * FROM users WHERE userid = $1`;
    try {
      const { rows } = await pool.query(userQ, [req.params.id]);
      if (!rows) {
        return res.status(404)
                        .json({
                      "status": "error",
                        "error": "User not found"
                  });
      }
      rows[0].password = undefined;
      return res.status(200)
                    .json({
                      "status": "success",
                      "data": {
                        "userId": rows[0].userid,
                        "firstName": rows[0].first_name,
                        "lastName": rows[0].last_name,
                        "email": rows[0].email,
                        "jobRole": rows[0].role
                      }
                    });
    } catch(error) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to get User"
                  });
    }
  }



   async function updateUser(req, res) {
    const findOneQuery = 'SELECT * FROM users WHERE userid=$1';
    const updateOneQuery =`UPDATE users
      SET first_name=$1, last_name=$2, email=$3, password=$4,
      role=$5
      WHERE userid=$6 returning *`;
    try {
      const { rows } = await pool.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404)
                      .json({
                      "status": "error",
                        "error": "User not found"
                    });
      }
        let profile = rows;
          const authorized = profile && req.auth && profile[0].userid == req.auth.userId
            if (!(authorized)) {
           return res.status(403)
                        .json({
                            "status": "error",
                              "error": "User is not authorized"
                        })
      }
       const values = [
          req.body.firstName || rows[0].firstName,
          req.body.lastName || rows[0].lastName,
          req.body.email || rows[0].email,
          req.body.password || rows[0].password,
          req.body.role || rows[0].role,
          req.params.id
    ];
      const response = await pool.query(updateOneQuery, values);
      return res.status(200)
                .json({
                  "status": "success",
                  "data": {
                      "message": "User successfully updated",
                  }
                });
    } catch(err) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to query database"
                  });
    }
  }


async function deleteUser(req, res, next) {
    const deleteQuery = `DELETE FROM users WHERE userid=$1 RETURNING *`;
    try{
        const { rows } = await pool.query(deleteQuery, [req.params.id]);
          if(!rows[0]) {
            return res.status(400)
                        .json({
                          "status": "error",
                          "error": "User not found"
                  });
          }
            let profile = rows;
                const authorized = profile && req.auth && profile[0].userid == req.auth.userId
                  if (!(authorized)) {
                 return res.status(403)
                              .json({
                                "status": "error",
                                "error": "User is not authorized"
                        })
            }
          return res.status(200)
                    .send({
                      "status": "success",
                      "data": {
                          "message": "User Successfully deleted"
                      }
                    })
      } catch(error) {
      return res.status(404)
                    .json({ 
                      "status": "error",
                      "error": "Unable to delete User"
                  });
    }
  }


  module.exports = {createLender, listUsers, getUser, updateUser, deleteUser }