const pool = require ('../DB/db-query');

async function createLoan (req, res) {
    const createQuery = `
    INSERT INTO
      loans(
        amount, 
        status,
        description,     
        userid,
        lenderid,  
        createdOn       
        )
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      req.body.amount,
      req.body.status,
      re.body.description,
      req.body.userid,
      req.body.lenderid,
      moment(new Date())
    ];

    try {
      const { rows } = await pool.query(createQuery, values);
        return res.status(201)
                  .json({
                    "status": "success",
                    "data": {
                    "message": "Article successfully created",
                    "loanId": rows[0].loanid,
                    "createdOn": rows[0].createdOn
                    }
                    });
    } catch(error) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to create articles"
                  });
              }
           }


  async function listLoans(req, res) {
    const usersQ= 'SELECT * FROM loans ORDER BY loanid ASC'; 
    try {
      const { rows } = await pool.query(usersQ);
      if (!rows) {
        return res.status(404)
                        .json({
                      "status": "error",
                        "error": "Loans not found"
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
                      "error": "Unable to get loans"
                  });
    }
  }



  async function getLoan(req, res) {
    const userQ = `SELECT * FROM loans WHERE loanid = $1`;
    try {
      const { rows } = await pool.query(userQ, [req.params.id]);
      if (!rows) {
        return res.status(404)
                        .json({
                      "status": "error",
                        "error": "Loan not found"
                  });
      }
      rows[0].password = undefined;
      return res.status(200)
                    .json({
                      "status": "success",
                      "data": {
                        "loanId": rows[0].loanid,
                        "amount": rows[0].amount,
                        "status": rows[0].status,
                        "description": rows[0].description,
                        "lenderId": rows[0].lenderid
                      }
                    });
    } catch(error) {
      return res.status(400)
                    .json({ 
                      "status": "error",
                      "error": "Unable to get Loan"
                  });
    }
  }



   async function updateLoan(req, res) {
    const findOneQuery = 'SELECT * FROM loans WHERE loanid=$1';
    const updateOneQuery =`UPDATE loans
      SET amount=$1, status=$2, description=$3
      WHERE loanid=$4 returning *`;
    try {
      const { rows } = await pool.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404)
                      .json({
                      "status": "error",
                        "error": "Loan not found"
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
          req.body.amount || rows[0].amount,
          req.body.status || rows[0].status,
          req.body.description || rows[0].description,
          req.params.id
    ];
      const response = await pool.query(updateOneQuery, values);
      return res.status(200)
                .json({
                  "status": "success",
                  "data": {
                      "message": "Loan successfully updated",
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


async function deleteLoan(req, res, next) {
    const deleteQuery = `DELETE FROM loans WHERE loanid=$1 RETURNING *`;
    try{
        const { rows } = await pool.query(deleteQuery, [req.params.id]);
          if(!rows[0]) {
            return res.status(400)
                        .json({
                          "status": "error",
                          "error": "Loan not found"
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
                          "message": "Loan Successfully deleted"
                      }
                    })
      } catch(error) {
      return res.status(404)
                    .json({ 
                      "status": "error",
                      "error": "Unable to delete Loan"
                  });
    }
  }


  module.exports = { 
         createLoan,
          listLoans,
          updateLoan,
          deleteLoan,
          getLoan
        }