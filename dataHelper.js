const { transactionDict } = require("./mock_data");

// Generate mock account balance
function generateBalance() {
  return randomDecimal(0.0, 100000.0);
}

// Generate mock transactions
function generateTransactions() {
  const transactions = [];
  const endDate = new Date();
  const startDate = new Date(
    new Date(new Date().setDate(1)).setMonth(endDate.getMonth() - 2)
  );

  // For a more realistic data, should consists of only one time of bill on the 1st of each month
  const utilTrans = transactionDict.find((x) => x.Category === "Utilities");
  utilTrans.Items.map((item) => {
    transactions.push({
      date: new Date(
        new Date(new Date().setMonth(startDate.getMonth() + 2)).setDate(1)
      ),
      amount: randomDecimal(item.Min, item.Max),
      category: utilTrans.Category,
      description: item.Description,
      account: item.Account,
    });

    transactions.push({
      date: new Date(
        new Date(new Date().setMonth(startDate.getMonth() + 1)).setDate(1)
      ),
      amount: randomDecimal(item.Min, item.Max),
      category: utilTrans.Category,
      description: item.Description,
      account: item.Account,
    });

    transactions.push({
      date: startDate,
      amount: randomDecimal(item.Min, item.Max),
      category: utilTrans.Category,
      description: item.Description,
      account: item.Account,
    });
  });

  // Generate 40-100 records is good enough for display purpose
  for (var i = randomInt(60); i <= 100; i++) {
    let tran = transactionDict[randomInt(transactionDict.length - 1)];
    let item = tran.Items[randomInt(tran.Items.length - 1)];

    transactions.push({
      date: randomDate(startDate, endDate),
      amount: randomDecimal(item.Min, item.Max),
      category: tran.Category,
      description: item.Description,
      account: item.Account,
    });
  }

  return transactions;
}

// Util to random date
function randomDate(startDate, endDate) {
  return new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );
}

// Util to random integer
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// Util to random decimal
function randomDecimal(min, max) {
  return Math.floor(Math.random() * (max * 100 - min * 100) + min * 100) / 100;
}

module.exports = { generateBalance, generateTransactions };
