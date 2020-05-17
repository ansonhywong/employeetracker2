const inquirer = require('inquirer');
const db = require('./db');

//To prompt user for action selection
const question = [
  {
    type: "list",
    name: "option",
    message: "Select one of the following options:",
    choices: [
      "01. View ALL Departments",
      "02. View ALL Roles",
      "03. View ALL Employees",
      "04. Add new Department",
      "05. Add new Role",
      "06. Add new Employee",
      "07. Update Employee Role",
      "EXIT"
    ]
  }
];

function welcome() {
  inquirer.prompt(
    [
      {
        type: "list",
        name: "welcomeOption",
        message: "Welcome to Anson's Employee Database!\n" +
          "This application will allow you to View, Add, Update and Delete any of my employee's information.",
        choices: [
          "Start",
          "EXIT"
        ]
      }
    ]
  ).then((answer) => {
    // Verify the chosen option
    switch (answer.welcomeOption) {
      case "Start": // Option "Start" (initiate program)
        init();
        break;

      default:
        closeConnection();
        break;
    }
  });
}

//To Kill function (Case 7)
function closeConnection() {
  console.log("\n[WARNING] Closing connection with database..\n");
  db.end();
}

//If any of Case 0-6 is selected, init function will redirect to either of view/add/update function
function init() {
  inquirer.prompt(question).then((response) => {
    // Verify the chosen option
    switch (parseInt(question[0].choices.indexOf(response.option))) {
      case 0:
      case 1:
      case 2:
        viewItem(parseInt(question[0].choices.indexOf(response.option)));
        break;

      case 3:
      case 4:
      case 5:
        addNew(parseInt(question[0].choices.indexOf(response.option)));
        break;

      case 6:
        updateEmployeeRole();
        break;

      case 7:
        closeConnection();
        break;
    }
  });
}

//View function for Case 0-2
function viewItem(task) {

  function viewAllDeparments() {
    let query = "SELECT * FROM Department";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log(res)
    });
  }

  function viewRole() {
    let query = "SELECT * FROM Role";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log(res)
    });
  }

  function viewAllEmployees() {
    let query = "SELECT * FROM Employee";
    db.query(query, function (err, res) {
      if (err) throw err;
      console.log(res)
    });
  }

  switch (task) {
    case 0: //view depts

      viewAllDeparments();

    case 1: //view roles

      viewRole();

    case 2: //view employees

      viewAllEmployees();

  }
};

// //Add function for Case 3-5

function addNew(task) {

  async function newRole() {
    try {
      let { role } = await inquirer.prompt({
        type: "input",
        name: "role",
        message: "Please enter the role's name?",
      });
      let { salary } = await inquirer.prompt({
        type: "input",
        name: "salary",
        message: "How much will this role be paid?",
      });
      db.query(
        "INSERT INTO Role SET ?",
        {
          title: (`${role}`.toUpperCase()),
          salary: (`${salary}`)
        },
        function (err) {
          console.log(err);
        }
      )
      // init();
    } catch (err) {
      console.log(err)
    }
  };

  async function newEmployee() {
    try {
      let { first_name } = await inquirer.prompt({
        type: "input",
        name: "first_name",
        message: "Please enter employee's fist name:",
      });
      let { last_name } = await inquirer.prompt({

        type: "input",
        name: "last_name",
        message: "Please enter employee's last name:",
      });
      newRole()
      db.query(
        "INSERT INTO Employee SET ?",
        {
          first_name: (`${first_name}`.toUpperCase()),
          last_name: (`${last_name}`.toUpperCase())
        },
        function (err) {
          console.log(err);
        }
      )
    } catch (err) {
      console.log(err)
    }
  };

  async function newDepartment() {
    try {
      let { newDept } = await inquirer.prompt({
        type: "list",
        name: "newDept",
        message: "Please, select one of the below departments:",
        choices: [
          "01. Accounting",
          "02. Sales",
          "03. HR",
          "04. Manufacturing",
          "05. Procurement",
          "06. Marketing",
          "07. Finance",
          "08. Maintenance",
          "09. Visual Arts",
          "10. IT Support"
        ]
      }
      )
      db.query(
        "INSERT INTO Department SET ?",
        {
          department_name: (`${newDept}`.toUpperCase())
        },
        function (err) {
          console.log(err);
        }
      )
      init();
    } catch (err) {
      console.log(err)
    }
  };

  switch (task) {
    case 3: //new dept

      newDepartment();

    case 4: //new role

      newRole();

    case 5: //new employee

      newEmployee();

    default:
  }
}

//Update function for Case 6

function updateEmployeeRole() {

  inquirer.prompt([
    {
      message: "What is the Employee ID?",
      type: "number",
      name: "id",

    },
    {
      message: "What is the employee's updated role?",
      type: "input",
      name: "title"
    },
    {
      message: "What is the employee's updated salary?",
      type: "number",
      name: "salary"
    }
  ]).then(function (response) {

    db.query("UPDATE Role SET title = ?, salary = ? WHERE id = ?", [response.title.toUpperCase(), response.salary, response.id], function (err, data) {
      console.log("EMPLOYEE " + response.id + " HAS BEEN UPDATED!")
      viewAllEmployees();

    })

  })

}

//To start application
welcome();