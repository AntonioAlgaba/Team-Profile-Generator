const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

//const render = require("./src/page-template.js");
const generateTeam = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
const teamArray = [];

// manager function
const addManager = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'name',
            message: 'Who is the manager of this team?', 
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the manager's ID:",
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the manager's email:",
            
        },
        {
            type: 'input',
            name: 'officeNumber',
            message: "Please enter the manager's office number:",
           
        }
    ])
    .then(managerInput => {
        const  { name, id, email, officeNumber } = managerInput; 
        const manager = new Manager (name, id, email, officeNumber);

        teamArray.push(manager); 
        //console.log(manager); 
    })
};

const addEmployee = () => {

    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "Please choose your employee's role:",
            choices: ['Engineer', 'Intern']
        },
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the employee?", 
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID:",
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email:",
        },
        {
            type: 'input',
            name: 'github',
            message: "Please enter the employee's github username:",
            when: (input) => input.role === "Engineer",
        },
        {
            type: 'input',
            name: 'school',
            message: "Please enter the intern's school:",
            when: (input) => input.role === "Intern",
            
        },
        {
            type: 'confirm',
            name: 'confirmAddEmployee',
            message: 'Would you like to add more team members?',
            default: false
        }
    ])
    .then(employeeData => {
        
        // data for employee types 

        let { name, id, email, role, github, school, confirmAddEmployee } = employeeData; 
        let employee; 

        if (role === "Engineer") {
            employee = new Engineer (name, id, email, github);

            //console.log(employee);

        } else if (role === "Intern") {
            employee = new Intern (name, id, email, school);

           // console.log(employee);
        }

        teamArray.push(employee); 

        if (confirmAddEmployee) {
            return addEmployee(teamArray); 
        } else {
            return teamArray;
        }
    })

};


// function to generate HTML page file using file system 
const createHTMLFile = () => {
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFile(outputPath, generateTeam(teamArray), "utf-8", (err) => {
        if(err){
         console.log('Could not save file')
        } else {
         console.log('Succes: new index.html file generated')
        }
 });
}

// calling all function in order
addManager()
  .then(addEmployee)
  .then(teamArray => {
    return generateTeam(teamArray);
  })
  .then(createHTMLFile)
  .catch(err => {
 console.log(err);
  });

