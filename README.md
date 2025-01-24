# Instagram Clone

A fullstack social media platform using JavaScript, Node.js, Express, and React with a PostgreSQL database, allowing users to register, log in, create posts, comment, follow/unfollow users, and like/share posts. Later as I started learning Java, I redesigned the backend using Maven and Spring Boot. Both backends use RESTful API's as a design architecture, while the Java backend was also built with OOP principles in mind.

For the frontend, I developed an interactive UI with React.js, implementing state management for user actions like creating posts, commenting, and following/unfollowing. In terms of aesthetics and functionality, I drew inspiration from Instagram and tried making my app as easy to use and intuitive as possible (though it does not look quite as nice as Instagram). 

Some of the key features of the project are:
- User authentication implemented using JWT
- Role-based access control (registered user / guest)
- Handling CRUD operations for posts and comments
- A dynamic following system
- Cloudinary for image uploads
- Error handling across all layers

Both backends and the frontend contain minimal tests for various functionalities. I've used Selenium, Cucumber and Cypress in order to write and run the tests, just to gain practice with these pieces of software. The README.md of each component (backends and frontend) contains more information about the tests.
 
## Notes:
- The project backend contains the Prisma schema file for database table generation, but I used a locally installed Postgres so the information there is not present in this repo. Will have to `npm install` the project if forked and run `npx prisma generate` to apply the Prisma database configuration.
- `.env` is missing so the JavaScript backend will need an `.env` file for the JWT secret (run backend with `npm start`).
- Will also need PostgreSQL on your machine.
- Frontend run with `npm run dev`.
- Finally, will need Maven to run the Java backend (`mvn spring-boot:run`).

## Project Structure:
The `src` folder contains a frontend and two backends, one written in JS and one in Java, but both function identically so you can swap one for the other and the frontend will still work fine.

### FRONTEND
The `src` was split into the `API` folder, containing the endpoints. The folder `Components` contains all the React components, like home page, posts, profiles, etc. The CSS was placed in the `Styles` folder.

### BACKEND JS
Structured using the logic of separating files into controllers/services/repositories. The folders for comments, posts, and users all follow that logic, while the remaining folders hold the Prisma files, the routes, and other app configurations (e.g., `app.js`, Cloudinary, JWT).

### BACKEND JAVA
Main app package named `com.yapbook` (the original name of the project). Used the same separation logic for comments, posts, and users as above, with the `config` folder containing configurations like Cloudinary, global error handler, and web config (CORS), and the `security` folder containing the authentication logic, token validation, a customized filter to check for tokens in order to authenticate users, and a password encoder.

