const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'F80mo1xPeOqzkJV89DOT',
      database: 'abccompany_db'
    },
    console.log(`Connected to the abccompany_db database.`)
  );


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

function viewAllRoles(){
    db.query('SELECT * FROM role;', function (err, results) {
        if (err){
            console.log("Unable to retrieve the role table.");
            return options();
        }
        console.table(results);
        return options();
    });
}

function viewAllEmployees() {
  db.query(
    `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
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

function updateEmployeeRole(){
  db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS fullname FROM employee;`, function (err, results) {
  if (err){
      console.log("Unable to retrieve the department table.");
      return options();
  }
  let nameList = [];

  for (let i=0; i < results.length; i++){
    let nameResult = results[i];
    let nameValue = nameResult["fullname"];
    nameList.push(nameValue);
  }

  console.log(nameList);

  inquirer
  .prompt([
    {
      type: "list",
      name: "employee_name",
      message: "Which employee's role would you like to update?",
      choices: nameList
    },
  ]).then((response) => {
      console.log(response);
    }
  )
})};


// function updateEmployeeRole(){
  
//     const employeeList = db.query(`SELECT id, CONCAT(first_name, " ", last_name) AS fullname FROM employee;`);
//     console.log(employeeList);
//     inquirer
//     .prompt([
//       {
//         type: "list",
//         name: "employee_name",
//         message: "Which employee's role would you like to update?",
//         choices: [
//           employeeList
//         ]
//       },
//       {
//         type: "list",
//         name: "lname",
//         message: "Which role would you like to assign to the selected employee?",
//         choices: [

//         ]
//       },
//     ])
//     .then((response) => {
//           if (err) {
//             console.log("Unable to update the employee.");
//             console.log(err)
//             return options();
//           } else {
//             console.table()
//             console.log("Successfully updated the employee!");
//             return options();
//           }
//         });
//     };

function exit(){
    console.log(`Thank you for visiting ABC company's database. See you next time!`)
}

// async function viewAllDepartment(){
//     try {
//         const allDepartment = await db.query('SELECT * FROM department;').then((err,res)=>{
//             console.table(allDepartment);
//         });
//     } catch (err) {
//          console.error(err)
//     }
//     options();
// }

options();