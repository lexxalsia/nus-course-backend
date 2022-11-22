let transactionDict = [
  {
    Category: "Transport",
    Items: [
      {
        Description: "Taxi fare",
        Max: -50.0,
        Min: -5.0,
        Account: "Credit Card",
      },
      { Description: "Bus fare", Max: -6.0, Min: -2.0, Account: "Credit Card" },
      { Description: "Petrol", Max: -40.0, Min: -5.0, Account: "Credit Card" },
      {
        Description: "Car rental",
        Max: -60.0,
        Min: -10.0,
        Account: "Credit Card",
      },
      {
        Description: "MRT fare",
        Max: -10.0,
        Min: -2.0,
        Account: "Credit Card",
      },
    ],
  },
  {
    Category: "Food",
    Items: [
      {
        Description: "Coffee shop",
        Max: -30.0,
        Min: -3.0,
        Account: "Credit Card",
      },
      {
        Description: "Food court",
        Max: -30.0,
        Min: -3.0,
        Account: "Credit Card",
      },
      {
        Description: "Shopping mall",
        Max: -100.0,
        Min: -5.0,
        Account: "Credit Card",
      },
      { Description: "Cafe", Max: -60.0, Min: -8.0, Account: "Credit Card" },
      {
        Description: "Restaurant",
        Max: -150.0,
        Min: -15.0,
        Account: "Credit Card",
      },
    ],
  },
  {
    Category: "Shopping",
    Items: [
      {
        Description: "Clothing store",
        Max: -250.0,
        Min: -15.0,
        Account: "Credit Card",
      },
      {
        Description: "Hardware store",
        Max: -400.0,
        Min: -5.0,
        Account: "Credit Card",
      },
      {
        Description: "Supermarket",
        Max: -100.0,
        Min: -3.0,
        Account: "Credit Card",
      },
      {
        Description: "Game store",
        Max: -200.0,
        Min: -8.0,
        Account: "Credit Card",
      },
      {
        Description: "Online store",
        Max: -100.0,
        Min: -10.0,
        Account: "Credit Card",
      },
    ],
  },
  {
    Category: "Misc",
    Items: [
      {
        Description: "Bicycle maintanance",
        Max: -50.0,
        Min: -5.0,
        Account: "Credit Card",
      },
      {
        Description: "Court booking",
        Max: -14.8,
        Min: -3.0,
        Account: "Credit Card",
      },
    ],
  },
  {
    Category: "Transfer",
    Items: [
      {
        Description: "Pay off credit card balance",
        Max: 5000.0,
        Min: 100.0,
        Account: "Saving Account",
      },
      {
        Description: "Third party transfer",
        Max: 200.0,
        Min: -200.0,
        Account: "Saving Account",
      },
    ],
  },
  {
    Category: "Utilities",
    Items: [
      {
        Description: "Utility bill",
        Max: -250.0,
        Min: -10.0,
        Account: "Credit Card",
      },
      {
        Description: "Rental",
        Max: -2500.0,
        Min: -2500.0,
        Account: "Credit Card",
      },
      {
        Description: "Mobile postpaid",
        Max: -300.0,
        Min: -300.0,
        Account: "Credit Card",
      },
    ],
  },
];

let users = [
  {
    first_name: "Dena",
    last_name: "Charle",
    email: "dcharle0@indiegogo.com",
    user_id: 1,
    phone: "98765433",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
  {
    first_name: "Dynah",
    last_name: "Waiting",
    email: "dwaiting1@google.com.br",
    user_id: 2,
    phone: "98765434",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
  {
    first_name: "Marc",
    last_name: "Conibeer",
    email: "mconibeer2@desdev.cn",
    user_id: 3,
    phone: "98765555",
    plan_id: 1,
    signup_date: "2021-01-01T00:00:00.000Z",
  },
];

function get_all_users() {
  return users;
}
function get_user_by_user_id(user_id) {
  for (i = 0; i < users.length; i++) {
    if (users[i].user_id == user_id) {
      return users[i];
    }
  }
}

function add_user(user) {
  users.push(user);
}

module.exports = {
  transactionDict,
  add_user,
  get_all_users,
  get_user_by_user_id,
};
