const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DBNAME,
  socketPath: process.env.INSTANCE_UNIX_SOCKET || "",
  multipleStatements: true,
  typeCast: function castField(field, useDefaultTypeCasting) {
    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if (field.type === "BIT" && field.length === 1) {
      var bytes = field.buffer();

      // A Buffer in Node represents a collection of 8-bit unsigned integers.
      // Therefore, our single "bit field" comes back as the bits '0000 0001',
      // which is equivalent to the number 1.
      return bytes[0] === 1;
    }

    return useDefaultTypeCasting();
  },
};

// User
var getUser = (email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT Email, LastName, FirstName, Active, CreatedOn, ModifiedOn 
        FROM Users WHERE Email = '${email}';`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results[0]));
        }
      }
    );
  });
};

var addUser = (newUser) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` INSERT INTO Users (Id, Email) 
        VALUES (uuid(), '${newUser.email}');`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            ` SELECT Id, Email, LastName, FirstName, Active 
              FROM Users WHERE Email = '${newUser.email}';`,
            (err, results) => {
              connection.end();

              if (err) {
                reject(err);
              } else {
                resolve(JSON.stringify(results[0]));
              }
            }
          );
        }
      }
    );
  });
};

var updateUser = (user) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` UPDATE Users SET
        LastName = '${user.lastName}',
        FirstName = '${user.firstName}',
        Active = ${user.active}
        WHERE Email = '${user.email}';`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            ` SELECT Id, Email, LastName, FirstName, Active 
              FROM Users WHERE Email = '${user.email}';`,
            (err, results) => {
              connection.end();

              if (err) {
                reject(err);
              } else {
                resolve(JSON.stringify(results[0]));
              }
            }
          );
        }
      }
    );
  });
};

// Account
var getAccountBalance = (email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      `SELECT B.Balance 
      FROM Balances B 
      INNER JOIN Users U ON U.Id = B.UserId 
      WHERE U.Email = '${email}';`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results[0]));
        }
      }
    );
  });
};

var addAccountBalance = (balance, email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` INSERT INTO Balances (Id, UserId, Source, Balance) 
        SELECT uuid(), Id, 'Mock', ${balance} 
        FROM Users WHERE Email = '${email}'
        ON DUPLICATE KEY UPDATE Balance = ${balance};`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(results["affectedRows"] != 0 ? true : false);
        }
      }
    );
  });
};

var getAccountOverview = (email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT SUM(t.Amount) AS Sum, t.Category
        FROM Transactions t INNER JOIN 
        Users u ON u.Id = t.UserId 
        WHERE u.Email = '${email}' AND t.Date >= date_add(date_add(LAST_DAY(CURDATE()),interval 1 DAY),interval -1 MONTH)
        GROUP BY t.Category 
        ORDER BY Sum ASC
        LIMIT 5;`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results));
        }
      }
    );
  });
};

// Transaction
var getTransactions = (startDate, endDate, category, description, email) => {
  const params = [
    startDate,
    startDate,
    endDate,
    endDate,
    category,
    category,
    description,
    "%" + description + "%",
  ];

  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT t.Id, t.Date, t.Amount, t.Description, t.Category, t.Account
        FROM Transactions t INNER JOIN 
        Users u ON u.Id = t.UserId 
        WHERE u.Email = '${email}'
        AND t.Date >= IF (? IS NOT NULL, ?, '1000-01-01')
        AND t.Date <= IF (? IS NOT NULL, ?, '2999-12-31')
        AND (? IS NULL OR t.Category = ?)
        AND (? IS NULL OR t.Description LIKE ?)
        ORDER BY t.Date DESC;`,
      params,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results));
        }
      }
    );
  });
};

var getTransactionsByCategory = (startDate, endDate, email) => {
  const params = [startDate, startDate, endDate, endDate];

  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT ABS(SUM(t.Amount)) AS Amount, t.Category
        FROM Transactions t INNER JOIN 
        Users u ON u.Id = t.UserId 
        WHERE u.Email = '${email}'
        AND t.Date >= IF (? IS NOT NULL, ?, '1000-01-01')
        AND t.Date <= IF (? IS NOT NULL, ?, '2999-12-31')
        GROUP BY t.Category
        ORDER BY Amount DESC;`,
      params,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results));
        }
      }
    );
  });
};

var addTransactions = (transactions, email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT Id 
        FROM Users WHERE Email = '${email}';`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const id = JSON.parse(JSON.stringify(results[0])).Id;

          connection.query(
            ` INSERT IGNORE INTO Transactions (UserId, Date, Amount, Description, Category, Account) VALUES ? `,
            [
              transactions.map((transaction) => [
                id,
                transaction.date,
                transaction.amount,
                transaction.description,
                transaction.category,
                transaction.account,
              ]),
            ],
            (err, results) => {
              connection.end();

              if (err) {
                reject(err);
              } else {
                resolve(results["affectedRows"] != 0 ? true : false);
              }
            }
          );
        }
      }
    );
  });
};

// Plan
var getPlans = (email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT p.Id, p.Name, p.Active, p.CreatedOn, p.ModifiedOn
        FROM Plans p INNER JOIN 
        Users u ON u.Id = p.UserId 
        WHERE u.Email = '${email}'
        ORDER BY p.CreatedOn DESC;`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results));
        }
      }
    );
  });
};

var getPlan = (pid, email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` SELECT p.Id, p.Name, p.Settings, p.Active, p.CreatedOn, p.ModifiedOn
        FROM Plans p INNER JOIN 
        Users u ON u.Id = p.UserId 
        WHERE u.Email = '${email}' AND p.Id = '${pid}';`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(results[0]));
        }
      }
    );
  });
};

var addPlan = (newPlan, email) => {
  const newId = uuidv4();

  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` INSERT INTO Plans (Id, UserId, Name, Settings) 
        SELECT '${newId}', Id, '${newPlan.name}', '${newPlan.settings}' FROM Users 
        WHERE Email = '${email}';`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            ` SELECT p.Id, p.Name, p.Settings, p.Active
              FROM Plans p
              INNER JOIN Users u ON u.Id = p.UserId
              WHERE p.Id = '${newId}' AND u.Email = '${email}';`,
            (err, results) => {
              connection.end();

              if (err) {
                reject(err);
              } else {
                resolve(JSON.stringify(results[0]));
              }
            }
          );
        }
      }
    );
  });
};

var updatePlan = (plan, email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` UPDATE Plans INNER JOIN Users ON Users.Id = Plans.UserId
        SET 
        Plans.Name = '${plan.name}',
        Plans.Settings = '${plan.settings}',
        Plans.Active = ${plan.active}
        WHERE Plans.Id = '${plan.id}' AND Users.Email = '${email}';`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            ` SELECT p.Id, p.Name, p.Settings, p.Active
              FROM Plans p
              INNER JOIN Users u ON u.Id = p.UserId
              WHERE p.Id = '${plan.id}' AND u.Email = '${email}';`,
            (err, results) => {
              connection.end();

              if (err) {
                reject(err);
              } else {
                resolve(JSON.stringify(results[0]));
              }
            }
          );
        }
      }
    );
  });
};

var deletePlan = (pid, email) => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    connection.query(
      ` DELETE p 
        FROM Plans p INNER JOIN Users u ON u.Id = p.UserId
        WHERE p.Id = '${pid}' AND u.Email = '${email}';`,
      (err, results) => {
        connection.end();

        if (err) {
          reject(err);
        } else {
          resolve(results["affectedRows"] != 0 ? true : false);
        }
      }
    );
  });
};

module.exports = {
  getUser,
  addUser,
  updateUser,
  getAccountBalance,
  addAccountBalance,
  getAccountOverview,
  getTransactions,
  getTransactionsByCategory,
  addTransactions,
  getPlans,
  getPlan,
  addPlan,
  updatePlan,
  deletePlan,
};
