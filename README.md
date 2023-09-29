# Learning Node - Nasa Project <!-- omit in toc -->

This follow along project is part of the ZeroToMastery Node course.
The React frontend was provided by the course, and the backend was built from scratch with the instructor.

The course is available [here](https://academy.zerotomastery.io/p/learn-node-js).

The project is a simple API that allows to query data about spaceX launches and also populates a list planets from a CSV file from NASA data.

Since the course is a bit old (in tech time scale, one year old may be a lot! :D), I had to make some changes to the code to make it work with the latest versions of node, express, mongoose, etc.

The frontend is old and contains vulnearabilities, so I didn't bother to update it.

# Table of Contents <!-- omit in toc -->

- [1. List of what I learned](#1-list-of-what-i-learned)
- [2. 🌍 Overview of main sections](#2--overview-of-main-sections)
  - [2.1. 🚀 Launches](#21--launches)
    - [2.1.1. launch.router.js](#211-launchrouterjs)
    - [2.1.2. launch.controller.js](#212-launchcontrollerjs)
    - [2.1.3. launch.model.js](#213-launchmodeljs)
    - [2.1.4. launch.mongo.js](#214-launchmongojs)
  - [2.2. 🪐 Planets](#22--planets)
    - [2.2.1. planets.router.js](#221-planetsrouterjs)
    - [2.2.2. planets.controller.js](#222-planetscontrollerjs)
    - [2.2.3. planets.model.js](#223-planetsmodeljs)
    - [2.2.4. planets.mongo.js](#224-planetsmongojs)
- [3. 💣 Tricky parts](#3--tricky-parts)
  - [3.1. In app.js](#31-in-appjs)
  - [3.2. Database logic](#32-database-logic)
- [4. 📒 Conclusion](#4--conclusion)

# 1. List of what I learned

1. Node internals: js engine, apis, bindings, libuv
2. Callback queues
3. Node Modules
4. Package management
5. Nodemon
6. Express
7. Web servers
8. Model view controller pattern
9. Middleware
10. Route parameters
11. Postman
12. Dev dependencies
13. Express routers
14. Using files
15. Template engines
16. Layouts
17. Streams
18. Morgan
19. Serving apps with client side routing
20. Validation
21. Testing: Jest, supertest
22. Node performance: PM2 live clusters
23. Node performance: zero downtime restarts
24. Node performance: Worker threads
25. Databases: SQL and NOSQL
26. Databases: mongoDB + mongoose + node
27. Databases: referential integrity
28. Databases: upserting
29. Databases: tests with Jest
30. Using external APIs: running search queries on spaceX
31. APIs: pagination
32. APIs: minimizing api load
33. Managing secrets: .env file

# 2. 🌍 Overview of main sections

The app is implementing a Model View Controller pattern, with high separation of concern.
We have:

1. Server.js: starts the server, deals with ports, starts mongoDB and loads data.
2. App.js: implements the middleware (here: cors, json, morgan), the "versioning router", and loads the frontend.
3. v1Router.js: is the routers of routers. Will allow us in the future to load different routers when our database and functionnalities evolves, while letting people using our api not experience breaking changes and adopt new versions progressively. Basically, it adds a /v1 before each further routes.
4. 2 routers: one for dealing with lists of planets, one with launches of rockets.
5. Each router consists of 4 files: _.router.js, _.controller.js, _.model.js and _.mongo.js
6. router.js: implements the routes/endpoints of the route, associates http methods and paths with specific controller functions.
7. mongo.js: responsible for the actual interactions with the database.
   Contains functions to query, update, delete, etc., in the database.
   Acts as a layer of abstraction, so if you decide to change databases in the future, you'd mostly modify this layer without affecting the model or other parts of the application.
8. model.js: Represents the data structure and provides an interface to interact with the data, whether it's coming from a database, an external API, or other sources.
   Defines data validation, transformations, and other operations specific to the data.
9. controller.js: Contains the logic to handle specific routes.
   Acts as an intermediary between the router and the model, taking input from the router, processing it (if needed), calling the model for data, and sending a response back.
10. Additionnaly, in the services folder, we have a file that deals with the external database API, and a file that deals with the queries to the database (here, pagination aspect).
11. The secret api key is stored in a .env file, and the dotenv package is used to load it.

## 2.1. 🚀 Launches

### 2.1.1. launch.router.js

This is the router file.

1. It imports various controller functions like httpGetAllLaunches, httpAddNewLaunch, and httpAbortLaunch.
2. The router specifies that for a GET request to the root (/), the httpGetAllLaunches function should be executed. Similarly, for a POST request, the httpAddNewLaunch function is executed, and for a DELETE request with an ID parameter, the httpAbortLaunch function is executed.
3. Essentially, it routes HTTP requests to appropriate controller functions based on the method and path.

### 2.1.2. launch.controller.js

This is the controller file. The controller functions handle specific routes:

1. httpGetAllLaunches: Retrieves all launch data with optional pagination.
2. httpAddNewLaunch: Adds a new launch after validating the request body.
3. httpAbortLaunch: Aborts a launch based on an ID provided in the request path.

The controller functions use various methods from the model (launches.model.js) to interact with the data and return appropriate responses.

### 2.1.3. launch.model.js

The model represents the data structure and provides interfaces to interact with the data:

1. loadLaunchData: Loads launch data.
2. existsLaunchWithId: Checks if a launch with a specific ID exists.
3. getAllLaunches: Retrieves all launches with optional skip and limit for pagination.
4. scheduleNewLaunch: Schedules a new launch after checking the target planet and assigning a flight number.
5. abortLaunchById: Aborts a launch based on its ID.

The model interacts with the data access layer (launches.mongo.js) to perform CRUD operations.

### 2.1.4. launch.mongo.js

This is the data access layer file.

1. It defines the schema for the Launch using Mongoose, which is a MongoDB object modeling tool for Node.js. The schema defines the shape of documents within a collection in MongoDB.
2. The defined schema includes fields like flightNumber, launchDate, mission, rocket, target, customers, etc., along with their types and constraints.
3. The file exports a Mongoose model for the Launch based on the defined schema.

This model can be used to perform CRUD operations on the Launch collection in MongoDB.

## 2.2. 🪐 Planets

### 2.2.1. planets.router.js

Like the launches router, this file would define the routes or endpoints specific to planets.
It would link specific HTTP methods and paths (e.g., GET, POST, /planets, /planets/:id) to corresponding controller functions.

### 2.2.2. planets.controller.js

This file would contain the logic to handle requests related to planets.
It would define functions to handle actions like retrieving all planets, retrieving a specific planet by ID, adding a new planet, updating planet details, etc.
These functions would interact with the planets.model.js to access and modify planet data.

### 2.2.3. planets.model.js

Represents the data structure of planets and provides methods or interfaces to interact with planet data.
It might define functions to fetch planet data, add new planet data, update existing data, delete data, etc.
It would interact with the planets.mongo.js for actual database operations.

### 2.2.4. planets.mongo.js

This would be the data access layer specific to planets.
It would define the MongoDB schema for planets using tools like Mongoose.
The schema would define the shape of planet documents, including fields and their types.
This file would handle CRUD operations on the planets collection in MongoDB.

# 3. 💣 Tricky parts

## 3.1. In app.js

1. The order of the middleware is important. For example, if you put the cors middleware after the express.static middleware, the static files will not be served with the correct headers, and you'll get errors in the browser console.
2. "/_": This is a wildcard route in Express. The _ acts as a wildcard that matches any route for GET requests. So, any GET request that hasn't been matched by previous route handlers will be caught by this one. In the context of web applications, especially Single Page Applications (SPAs) built with frameworks like React or Vue, this pattern is very common. The reason is that SPAs handle routing on the client side. When a user navigates to a different route in their browser, the request goes to the server, which may not have a specific route defined for that path. By serving the main index.html for any unmatched routes, the server ensures that the SPA's client-side routing can take over and display the correct content or page. So, in essence, this catch-all route ensures that any unmatched GET request will return the main index.html file of the SPA, allowing the SPA's client-side router to then process the route and display the appropriate content.

```js
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
```

## 3.2. Database logic

Overall, there are a number of challenges when working with databases. One of the trickiest for me was to wrap my head around how to structure the code to interact with the database, like with the populateLaunch which has 2 parts - one with the axios.post to get the data from the SpaceX api, and another to populate withi this data.
The part getting data from spaceX is by the way one of these strange examples of a POST that is actually a GET: we need to use POST because we are sending a body, but we are not actually modifying anything in the database, we are just querying it.

```js
async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}
```

# 4. 📒 Conclusion

I learned a really good deal about all the intricacies of Node, internals and overall structure. Things have really taken shape in my head!

Though I think that things will fall more into place as soon as I will write my own project from scratch in a few weeks, and I will be able to apply the concepts I learned here!

I also think it will be beneficial to use a SQL database in my next project, to get a better understanding of the differences between SQL and NoSQL, and to get a better understanding of SQL in general.

But before that, I will move on to learn about:

1. Authentication and security
2. Continuous integration and Delivery
3. Node production and the cloud (Docker + AWS)
4. GraphQL
5. Sockets with Node
