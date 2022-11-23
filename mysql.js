const mysql = require("mysql");
require("dotenv").config();

const dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWD,
  database: process.env.DBNAME,
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

module.exports = { getUser, addUser, updateUser, getAccountBalance };
