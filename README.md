# Tasky

## A task manager CLI and API to keep track of your personal projects

### Why did I build Tasky?

For me, using enterprise level task managers to be cumbersome and other native notepads to be clunky and getting in the way.
I figured since, I spend alot of time in the terminal, having a task list that can be listed and updated a command away to be
conveinient. I figured it might also be helpful to be able to interact with tasks via an API. Hopefully you find Tasky to be
as useful as I do!

### Quick Start

Requires:
    Node: v21.7.0
    NPM: 10.5.0
    SQLite: ^3.4

CAUTION: Tasky stores all of its data on the machine it is ran on by default using the db configured in the .env file.

Clone down this repository and create a .env in the root of the directory following the .env.example tempmlate.
Then run ./build.sh or npm run dev from the root of the directory. If a tasks.db file does not exist in the root directory,
one will be generated. This is the file Sqlite3 will use by default.

The CLI will prompt you to create a user or login. Passwords are hashed but stored locally by default. Please be careful.

Start writing some tasks!

### Usage

### Contributing

If you would like to contribute, please fork the repository and open a pull request to the `main` branch.