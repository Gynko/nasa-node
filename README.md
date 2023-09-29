# Learning Node - Nasa Project <!-- omit in toc -->

This follow-along project is part of my Learning at school and part of the ZeroToMastery Node course.
The React frontend was provided by the course, and the backend was built from scratch with the instructor.

The course is available [here](https://academy.zerotomastery.io/p/learn-node-js).

The server queries data from the spaceX launches API, https://github.com/r-spacex/SpaceX-API. We also populate a list of planets from a CSV file downloaded on the NASA website, from which we filtered some data.

Since the course is a bit old (in tech time scale, one year old may be a lot! :D), I had to make some changes to the code to make it work with the latest versions of node, express, mongoose, etc.

The frontend is old and contains vulnerabilities. I didn't bother to update it, as it was not really the goal of the project.

# Table of Contents <!-- omit in toc -->

- [1. What we are building](#1-what-we-are-building)
- [2. Non-exhaustive list of what I learned](#2-non-exhaustive-list-of-what-i-learned)
- [3. 🌍 Overview of main sections](#3--overview-of-main-sections)
  - [3.1. 🚀 Launches](#31--launches)
    - [3.1.1. launch.router.js](#311-launchrouterjs)
    - [3.1.2. launch.controller.js](#312-launchcontrollerjs)
    - [3.1.3. launch.model.js](#313-launchmodeljs)
    - [3.1.4. launch.mongo.js](#314-launchmongojs)
  - [3.2. 🪐 Planets](#32--planets)
    - [3.2.1. planets.router.js](#321-planetsrouterjs)
    - [3.2.2. planets.controller.js](#322-planetscontrollerjs)
    - [3.2.3. planets.model.js](#323-planetsmodeljs)
    - [3.2.4. planets.mongo.js](#324-planetsmongojs)
- [4. 💣 Tricky parts](#4--tricky-parts)
  - [4.1. In app.js](#41-in-appjs)
  - [4.2. Database logic](#42-database-logic)
  - [4.3. Node internals: loops and phases](#43-node-internals-loops-and-phases)
- [5. 📒 Conclusion](#5--conclusion)

# 1. What we are building

Here we can create Launches. The destination explanet dropdown is made of planet extracted and filtered from a CSV file from NASA data, with Node and its tools. List hosted on mongoDB.
![Launch](https://i.postimg.cc/QCTzXZG7/Screenshot-2023-09-29-at-14-54-53.png)

Here in Launch we have a list of all the launches that are not aborted. We can abort them.
![Upcoming](https://i.ibb.co/7GsCBLs/Screenshot-2023-09-29-at-14-55-02.png)

Here we have a list of all launches past and present. Hosted on mongoDB.
![History](https://i.ibb.co/h1tk46y/Screenshot-2023-09-29-at-14-55-09.png)

# 2. Non-exhaustive list of what I learned

1. Node internals: js engine, apis, bindings, libuv. Really interesting to learn that many of the node apis are actually C++ code, and that the js engine is actually a C++ program.
2. Tthe event loop: is a loop that checks if the call stack is empty, and if so, it checks the callback queue, and if there is something in the callback queue, it pushes it to the call stack. The event loop is a C++ program, and it is part of the libuv library.
3. The call stack: is a stack of functions that are being executed. When a function is called, it is pushed to the call stack, and when it is finished, it is popped from the call stack.
4. The callback queue: is a queue of callback functions that are waiting to be executed. When a callback function is ready to be executed, it is pushed to the callback queue.
5. The event loop, the event loop phases: the event loop is a loop that checks if the call stack is empty, and if so, it checks the callback queue, and if there is something in the callback queue, it pushes it to the call stack. The event loop is a C++ program, and it is part of the libuv library. The event loop has 6 phases: timers, pending callbacks, idle, prepare, poll, check, close callbacks. The event loop phases are not part of the js specification, they are part of the node implementation.
6. The microtask queue: is a queue of microtasks that are waiting to be executed. When a microtask is ready to be executed, it is pushed to the microtask queue. Microtasks are executed before the next tick queue.
7. The timers queue: is a queue of timers that are waiting to be executed. When a timer is ready to be executed, it is pushed to the timers queue. Timers are executed before the next tick queue.
8. The poll phase
9. The check phase
10. The close phase
11. The timers phase
12. The pending phase
13. The next tick queue
14. Node Modules
15. Package management
16. Nodemon
17. Express
18. Web servers
19. Model view controller pattern
20. Middleware
21. Route parameters
22. Postman
23. Dev dependencies
24. Express routers
25. Using files
26. Template engines
27. Layouts
28. Streams
29. Morgan
30. Serving apps with client side routing
31. Validation
32. Testing: Jest, supertest
33. Node performance: PM2 live clusters
34. Node performance: zero downtime restarts
35. Node performance: Worker threads
36. Databases: SQL and NOSQL
37. Databases: mongoDB + mongoose + node
38. Databases: referential integrity
39. Databases: upserting: upserting refers to an operation that inserts a new record if it doesn't exist or updates the existing record if it does.
40. Databases: tests with Jest
41. Using external APIs: running search queries on spaceX
42. APIs: pagination
43. APIs: minimizing api load
44. Managing secrets: .env file

# 3. 🌍 Overview of main sections

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

## 3.1. 🚀 Launches

### 3.1.1. launch.router.js

This is the router file.

1. It imports various controller functions like httpGetAllLaunches, httpAddNewLaunch, and httpAbortLaunch.
2. The router specifies that for a GET request to the root (/), the httpGetAllLaunches function should be executed. Similarly, for a POST request, the httpAddNewLaunch function is executed, and for a DELETE request with an ID parameter, the httpAbortLaunch function is executed.
3. Essentially, it routes HTTP requests to appropriate controller functions based on the method and path.

### 3.1.2. launch.controller.js

This is the controller file. The controller functions handle specific routes:

1. httpGetAllLaunches: Retrieves all launch data with optional pagination.
2. httpAddNewLaunch: Adds a new launch after validating the request body.
3. httpAbortLaunch: Aborts a launch based on an ID provided in the request path.

The controller functions use various methods from the model (launches.model.js) to interact with the data and return appropriate responses.

### 3.1.3. launch.model.js

The model represents the data structure and provides interfaces to interact with the data:

1. loadLaunchData: Loads launch data.
2. existsLaunchWithId: Checks if a launch with a specific ID exists.
3. getAllLaunches: Retrieves all launches with optional skip and limit for pagination.
4. scheduleNewLaunch: Schedules a new launch after checking the target planet and assigning a flight number.
5. abortLaunchById: Aborts a launch based on its ID.

The model interacts with the data access layer (launches.mongo.js) to perform CRUD operations.

### 3.1.4. launch.mongo.js

This is the data access layer file.

1. It defines the schema for the Launch using Mongoose, which is a MongoDB object modeling tool for Node.js. The schema defines the shape of documents within a collection in MongoDB.
2. The defined schema includes fields like flightNumber, launchDate, mission, rocket, target, customers, etc., along with their types and constraints.
3. The file exports a Mongoose model for the Launch based on the defined schema.

This model can be used to perform CRUD operations on the Launch collection in MongoDB.

## 3.2. 🪐 Planets

### 3.2.1. planets.router.js

Like the launches router, this file would define the routes or endpoints specific to planets.
It would link specific HTTP methods and paths (e.g., GET, POST, /planets, /planets/:id) to corresponding controller functions.

### 3.2.2. planets.controller.js

This file would contain the logic to handle requests related to planets.
It would define functions to handle actions like retrieving all planets, retrieving a specific planet by ID, adding a new planet, updating planet details, etc.
These functions would interact with the planets.model.js to access and modify planet data.

### 3.2.3. planets.model.js

Represents the data structure of planets and provides methods or interfaces to interact with planet data.
It might define functions to fetch planet data, add new planet data, update existing data, delete data, etc.
It would interact with the planets.mongo.js for actual database operations.

### 3.2.4. planets.mongo.js

This would be the data access layer specific to planets.
It would define the MongoDB schema for planets using tools like Mongoose.
The schema would define the shape of planet documents, including fields and their types.
This file would handle CRUD operations on the planets collection in MongoDB.

# 4. 💣 Tricky parts

## 4.1. In app.js

1. The order of the middleware is important. For example, if you put the cors middleware after the express.static middleware, the static files will not be served with the correct headers, and you'll get errors in the browser console.
2. "/_": This is a wildcard route in Express. The _ acts as a wildcard that matches any route for GET requests. So, any GET request that hasn't been matched by previous route handlers will be caught by this one. In the context of web applications, especially Single Page Applications (SPAs) built with frameworks like React or Vue, this pattern is very common. The reason is that SPAs handle routing on the client side. When a user navigates to a different route in their browser, the request goes to the server, which may not have a specific route defined for that path. By serving the main index.html for any unmatched routes, the server ensures that the SPA's client-side routing can take over and display the correct content or page. So, in essence, this catch-all route ensures that any unmatched GET request will return the main index.html file of the SPA, allowing the SPA's client-side router to then process the route and display the appropriate content.

```js
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
```

## 4.2. Database logic

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

## 4.3. Node internals: loops and phases

There is an incredible amount of processes going on under the hood of Node, and it is really interesting to learn about them, but challenging to weave all the parts together.

This is one part that I want to get back to again later.

# 5. 📒 Conclusion

I learned a really good deal about all the intricacies of Node, internals and overall structure. Things have really taken shape in my head!

Though I think that things will fall more into place as soon as I will write my own project from scratch in a few weeks, and I will be able to apply the concepts I learned here!

I also think it will be beneficial to use a SQL database in my next project, to get a better understanding of the differences between SQL and NoSQL, and to get a better understanding of SQL in general.

But before that, I will move on to learn about:

1. Authentication and security
2. Continuous integration and Delivery
3. Node production and the cloud (Docker + AWS)
4. GraphQL
5. Sockets with Node
