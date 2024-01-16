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

