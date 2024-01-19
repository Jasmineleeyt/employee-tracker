// Include the packages/module required for this application 
const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

// Creates connection with my local database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'F80mo1xPeOqzkJV89DOT',
      database: 'abccompany_db'
    },
    console.log(`Connected to the abccompany_db database.`)
  );

// Creates an array of questions for user input
function options() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add a employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    // Calls the corresponding function based on user's choice
    .then((response) => {
        if (response.menu == "View all departments") {
          viewAllDepartment();
        } else if (response.menu == "View all roles") {
            viewAllRoles();
        } else if (response.menu == "View all employees") {
            viewAllEmployees();
        } else if (response.menu == "Add a department") {
            addDepartment();
        } else if (response.menu == "Add a role") {
            addRole();
        } else if (response.menu == "Add a employee") {
            addEmployee();
        } else if (response.menu == "Update an employee role") {
            updateEmployeeRole();
        } else if (response.menu == "Exit") {
            exit();
        }
    });
}

// Retrieves all the data from the department table
function viewAllDepartment(){
      db.query('SELECT * FROM department;', function (err, results) {
        if (err){
            console.log("Unable to retrieve the department table.");
            return options();
        }
        console.table(results);
        return options();
    });

}

// Retrieves and joins the data from the role table and the department table
function viewAllRoles(){
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department on role.department_id = department.id;', function (err, results) {
        if (err){
            console.log("Unable to retrieve the role table.");
            return options();
        }
        console.table(results);
        return options();
    });
}

// Retrieves and joins the data from the employee table, the role table, and the department table
function viewAllEmployees() {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee.manager_id
    FROM department
    JOIN role ON department.id = role.department_id
    JOIN employee ON role.id = employee.role_id;`,
    function (err, results) {
      if (err) {
        console.log("Unable to retrieve the employee table.");
        return options();
      }
      console.table(results);
      return options();
    }
  );
}

// Adds a new department based on user's input
function addDepartment(){
  inquirer
    .prompt({
      type: "input",
      name: "add_department",
      message: "Please enter the department that you would like to add.",
    })
    .then((response) => {
      const departmentName = response.add_department;
      db.query(`INSERT INTO department (name) VALUES ('${departmentName}');`, function (err, results) {
          if (err) {
            console.log("Unable to add the department");
            console.log(err)
            return options();
          } else {
            console.log("Successfully added the department.");
            return options();
          }
        });
    });
}

// Adds a new role based on user's inputs
function addRole(){
    inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the role that you would like to add:",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the salary for the role:",
      },
      {
        type: "input",
        name: "department_id",
        message: "Please enter the department ID of the role:",
      },
    ])
    .then((response) => {
      const { title, salary, department_id } = response;
      db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id});`, function (err, results) {
          if (err) {
            console.log("Unable to add the role.");
            console.log(err)
            return options();
          } else {
            console.log("Successfully added the role!");
            return options();
          }
        });
    });
}

// Adds a new employee based on user's inputs
function addEmployee(){
    inquirer
    .prompt([
      {
        type: "input",
        name: "fname",
        message: "Please enter the employee's first name:",
      },
      {
        type: "input",
        name: "lname",
        message: "Please enter the employee's last name:",
      },
      {
        type: "input",
        name: "role_id",
        message: "Please enter the employee's role ID:",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Please enter the employee's manager ID (please enter NULL if not applicable):",
      },
    ])
    .then((response) => {
      const { fname, lname, role_id, manager_id } = response;
      db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${fname}', '${lname}', ${role_id}, ${manager_id});`, function (err, results) {
          if (err) {
            console.log("Unable to add the employee.");
            console.log(err)
            return options();
          } else {
            console.log("Successfully added the employee!");
            return options();
          }
        });
    });
}

// Updates an employee's role
function updateEmployeeRole(){
  // Get all the required data from db
  db.query(`SELECT CONCAT(first_name, " ", last_name) AS fullname FROM employee;`, function (err, employeeNames) {
    if (err){
      console.log("Unable to retrieve the data.");
      return;
    }
    db.query(`SELECT id FROM employee;`, function (err, employeeIds) {
      if (err){
        console.log("Unable to retrieve the data.");
        return;
      }
      db.query(`SELECT title FROM role;`, function (err, roleTitles) {
        if (err){
          console.log("Unable to retrieve the data.");
          return;
        }
        db.query(`SELECT id FROM role;`, function (err, roleIds) {
          if (err){
            console.log("Unable to retrieve the data.");
            return;
          }
          
          // Loops through the data got above and creates new arrays with the values got by the keys 
          let employeeList = employeeNames.map((employeeName) => {
            return employeeName.fullname;
          })
          
          let employeeIdList = employeeIds.map((employeeId)=> {
            return employeeId.id;
          })

          let titleList = roleTitles.map((roleTitle) =>{
            return roleTitle.title;
          })

          let roleIdList = roleIds.map ((roleId) => {
            return roleId.id;
          })
            inquirer
            .prompt([
              {
                type: "list",
                name: "employee_name",
                message: "Which employee's role would you like to update?",
                choices: employeeList,
              },
              {
                type: "list",
                name: "employee_id",
                message: "What is the employee id of the employee?",
                choices: employeeIdList,
              },
              {
                type: "list",
                name: "role_title",
                message:"Which role would you like to assign to the selected employee?",
                choices: titleList,
              },
              {
                type: "list",
                name: "role_id",
                message: "What is the role id that you like to assign to the selected employee?",
                choices: roleIdList,
              },
            ])
            .then((response) => {
              const { employee_name, employee_id, role_title, role_id } = response;
              db.query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id} ;`, function (err, results) {
                  if (err) {
                    console.log("Unable to update the employee.");
                    console.log(err)
                    return options();
                  } else {
                    console.log("Successfully updated the employee!");
                    return options();
                  }
                });
            });
          });
        });
      });
    });
  };        

function exit(){
    console.log(`Thank you for visiting ABC company's database. See you next time!`)
}

options();