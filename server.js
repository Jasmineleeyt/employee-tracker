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
      db.query('SELECT * FROM department', function (err, results) {
        if (err){
            console.log("Unable to retrieve the department table.");
            return options();
        }
        console.table(results);
        return options();
    });

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

function viewAllRoles(){
    db.query('SELECT * FROM role', function (err, results) {
        if (err){
            console.log("Unable to retrieve the role table.");
            return options();
        }
        console.table(results);
        return options();
    });
}

function viewAllEmployees(){
    db.query('SELECT * FROM employee', function (err, results) {
        if (err){
            console.log("Unable to retrieve the employee table.");
            return options();
        }
        console.table(results);
        return options();
    });
}

function exit(){
    console.log(`Thank you for visiting ABC company's database. See you next time!`)
}


options();