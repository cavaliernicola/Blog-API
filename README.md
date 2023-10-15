# Tongue - REST API

<details> 
  <summary>Table of Contents</summary>

1. [Description](#description)
1. [Technologies](#technologies)
1. [Dependencies](#dependencies)
1. [Getting Started](#getting-started)
1. [License](#license)
1. [Contact Me](#contact-me)
</details>

## Description

Tongue is a Node.js application that provides a REST API that can manage the users, posts and interaction of an hypotetical online platform.

The main features of the API are:

```
1. Create/Read/Update/Delete Posts, Users and Interactions
2. Filter posts by multiple query filters
```

> **Note**: For more info about API usage visit the [documentation](https://github.com/cavaliernicola/Blog-API/blob/mysql/docs/index.md).

## Technologies

![Node.js](https://img.shields.io/badge/Node.js-black.svg?style=for-the-badge&logo=node.js&logoColor=green) ![MySQL](https://img.shields.io/badge/mysql-black?style=for-the-badge&logo=mysql&logoColor=yellow)

## Dependencies

- [knex](https://knexjs.org/)
- [WorldCities](https://github.com/OpenDataFormats/worldcities)
- [Express](https://knexjs.org/)
- [moment](https://momentjs.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/it/download)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
  > **Note**: The application uses a query builder which adapts the query for multiple SQL dialects. This project has been tested only for MySQL, check [main branch](https://github.com/cavaliernicola/Blog-API/tree/main) for PostgreSQL example.

### Installation

```sh
1. Clone the repository
git clone --single-branch --branch mysql https://github.com/cavaliernicola/Blog-API.git

2. Go to the project directory
Example: cd to/path/of/project

3. Install the dependencies
npm install

4. Add your own enviromental dependencies
Rename '.env.example' file to '.env' and change the values

4. Run the application
npm start
```

## License

Distributed under MIT License. See [`LICENSE`](LICENSE) for more information.

## Contact Me

- Author: Nicola Cavalier
- Email: cavaliernicola@gmail.com
