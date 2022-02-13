const connection = require('./db/connection');
const inquirer = require('inquirer');
const figlet = require('figlet');
const consoleTable = require('console.table');

// const openingScreen = () => {

   
// }

const addBlankLine = () => {
    console.log(` \n`)
}

// const startApp = async () => {
//     startQuestion();
//     // setTimeout(viewAllEmployees, 10);
// }

const startQuestion = () => {
    addBlankLine();
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Remove Employee', 
            'Update Employee Role', 
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View All Departments',
            'Add Department',
            'Remove Department',
            'End Program'
        ]
    })
        .then((answer) => {
            switch (answer.action) {

                case 'View All Employees':
                viewAllEmployees()
                break;

                case 'Add Employee':
                addEmployee()
                break;

                case 'Remove Employee':
                removeEmployee()
                break;

                case 'Update Employee Role':
                updateEmployeeRole()
                break;

                case 'View All Roles':
                viewAllRoles()
                break;

                case 'Add Role':
                addRole()
                break;

                case 'Remove Role':
                removeRole()
                break;

                case 'View All Departments':
                viewAllDepartments()
                break;

                case 'Add Department':
                addDepartment()
                break;

                case 'Remove Department':
                removeDepartment()
                break;

                case 'End Program':
                endProgram()
                break;
            }
        })
}

const viewAllEmployees = () => {
    addBlankLine();
    connection.query(
        `SELECT employees.id AS Id, employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Title, departments.department_name AS Departments, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id ORDER BY department_name ASC;`, 
        (err, res) => {
            if (err) throw err;
            console.table(res)
        }
    )
    setTimeout(startQuestion, 30);
}

const addEmployee = () => {
    addBlankLine();
    connection.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `first_name`,
                type: `input`,
                message: `Enter Employee First Name:`
            },
            {
                name: `last_name`,
                type: `input`,
                message: `Enter Employee Last Name:`
            },
            {
                name: `role`,
                type: `input`,
                message() {
                    const addEmployeeArray = [];
                    res.forEach(({ title, id }) => {
                        addEmployeeArray.push(id + ' = ' + title);
                    });
                    console.log(`What is the employee's role Id number?\n`)
                    return addEmployeeArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's role id number.";
                    }
                    return true;
                },
            },
            {
                name: `manager_id`,
                type: `input`,
                message: `Enter Manager's employee Id number:`
            }
        ])
            .then((answer) => {
                connection.query(
                    `INSERT INTO employees SET ?`,
                    [
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: answer.role,
                            manager_id: answer.manager_id
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} emloyee added. \n`)
                        viewAllEmployees();
                    }
                )
            })
    })
}

const removeEmployee = () => {
    addBlankLine();
    connection.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `employees`,
                type: `input`,
                message() {
                    const employeesArray = [];
                    res.forEach(({ id, first_name, last_name}) => {
                        employeesArray.push(`${id} ${first_name} ${last_name}`);
                    });
                    console.log(`What is the Id number of the employee to remove?\n`)
                    return employeesArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's Id number.";
                    }
                    return true;
                },
            },
        ])
            .then((answer) => {
                connection.query(`DELETE FROM employees WHERE ?`,
                {
                    id: (answer.employees)
                },
                (err, res) => {
                    if (err) throw err
                    console.log(`${res.affectedRows} Deleted\n`)
                    viewAllEmployees();
                }
                )
            })
    })
};

const updateEmployeeRole = () => {
    addBlankLine();
    connection.query(
        `SELECT employees.id "Id", employees.first_name "First Name", employees.last_name "Last Name" FROM employees;`,
        (err, res) => {
            if (err) throw err;
            console.table(res)
        }
    )
    connection.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `employeeID`,
                type: `input`,
                message: `Input the Id number of the employee you want to update:`,
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the employee's Id number";
                    }
                    return true;
                },
            },
            {
                name: `roleID`,
                type: `input`,
                message() {
                    const roleArray = [];
                    res.forEach(({ title, id }) => {
                        roleArray.push(id + ' = ' + title);
                    });
                    console.log(`What is the new role's Id number?\n`)
                    return roleArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the new role's Id number.";
                    }
                    return true;
                },
            }
        ])
            .then((answer) => {
                console.log(`Role: ${answer.roleID}`)
                console.log(`Employee Id: ${answer.employeeID}`)
                connection.query(`UPDATE employees SET ? WHERE ?;`,
                    [
                        {
                            role_id: (answer.roleID),
                        },
                        {
                            id: (answer.employeeID)
                        },
                    ],
                    (err, res) => {
                        if (err) throw err
                        console.log(`${res.affectedRows} employee updated\n`)
                        viewAllEmployees();
                    }
                )
            })
    })
};

const viewAllRoles = () => {
    addBlankLine();
    connection.query(
        `SELECT roles.id "Id", roles.title "Title" FROM roles;`,
        (err, res) => {
            if (err) throw err;
            console.table(res)
            startQuestion(); 
        }
    )
}

const addRole = () => {
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `title`,
                type: `input`,
                message: `Add New Role:`
            },
            {
                name: `salary`,
                type: `input`,
                message: `Add Salary:`,
            },
            {
                name: `departments`,
                type: `input`,
                message() {
                    const departmentArray = [];
                    res.forEach(({ department_name, id }) => {
                        departmentArray.push(id + ' = ' + department_name);
                    });
                    console.log(`Enter the Department's Id number?\n`)
                    return departmentArray.join(`\n`)
                },
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return "Please enter the Deartment's Id number.";
                    }
                    return true;
                },
            }
        ])
            .then((answer) => {
                connection.query(
                    `INSERT INTO roles SET ?`,
                    [
                        {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: answer.departments
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} new role added. \n`)
                        viewAllRoles();
                    }
                )
            })
    })
};

const removeRole = () => {
    connection.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `roles`,
                type: `rawlist`,
                message: `Which role would you like to remove? \n`,
                choices() {
                    const roleArray = [];
                    res.forEach(({ title }) => {
                        roleArray.push(title);
                    });
                    return roleArray;
                },
            },
        ])
            .then((answer) => {
                connection.query(`DELETE FROM roles WHERE ?`,
                {
                    title: (answer.roles)
                },
                (err, res) => {
                    if (err) throw err
                    console.log(`${res.affectedRows} Deleted \n`)
                    viewAllRoles();
                }
                )
            })
    })
}

const viewAllDepartments = () => {
    connection.query(
        `SELECT * FROM departments;`, 
        (err, res) => {
            if (err) throw err;
            console.table(res) 
            startQuestion(); 
        }
    )
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name: `name`,
            type: `input`,
            message: `Add New Department:`
        }
    ])
        .then((answer) => {
            connection.query(
                `INSERT INTO departments SET ?`,
                [
                    {
                        department_name: answer.name,
                    },
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} new department added. \n`)
                    viewAllDepartments();
                }
            )
        })
};

const removeDepartment = () => {
    connection.query(`SELECT * FROM departments;`,
    (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: `departments`,
                type: `rawlist`,
                message: `Which department would you like to remove? \n`,
                choices() {
                    const departmentArray = [];
                    res.forEach(({ department_name }) => {
                        departmentArray.push(department_name);
                    });
                    return departmentArray;
                },
            },
        ])
            .then((answer) => {
                connection.query(`DELETE FROM departments WHERE ?`,
                {
                    department_name: (answer.departments)
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Deleted \n`)
                    viewAllDepartments();
                }
                )
            })
    }
    )
};

const endProgram = () => {
    connection.end();
};

figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    startQuestion();

});

// startQuestion();
//   startApp();