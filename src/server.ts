import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { getXataClient } from "./xata";


dotenv.config();

const xata = getXataClient();

// Inference
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


// Adding user records to the database
app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { body } = req;
  try {
    const response = await xata.db.users.create(body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user",
      error,
    });
  }
});

// Getting all user records from the database
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const response = await xata.db.users.getAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch users",
      error,
    });
  }
});

// Getting a single user record from the database
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await xata.db.users.read(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch user",
      error,
    });
  }
});

// Updating a user record in the database
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  if (!id) {
    res.status(400).json({
      message: "ID is required",
    });
    return;
  }
  try {
    const availableUser = await xata.db.users.read(id);
    if (availableUser) {
      const response = await xata.db.users.update(id, body);
      res.status(200).json(response);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to update user",
      error,
    });
  }
});

// Patching a user record in the database (partial update)
app.patch("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const response = await xata.db.users.update(id, body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Failed to patch user",
      error,
    });
  }
});

// Deleting a user record from the database
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await xata.db.users.delete(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete user",
      error,
    });
  }
});








// Start the server
app.listen(port, () => {
  console.log(
    `[server]: Server TypeScript is running at http://localhost:${port} 😂😂😂😂`
  );
});









// // Handles data from event data
// app.get("/api/events", (req: Request, res: Response) => {
//   res.send(eventData);
// });

// // Faker database for demonstration
// const userData = [
//   { userID: 1, userName: "alamin", displayName: "alamin254" },
//   { userID: 2, userName: "Emmanuel", displayName: "emm254" },
//   { userID: 3, userName: "Kevin", displayName: "kev254" },
//   { userID: 4, userName: "John", displayName: "john254" },
// ];

// //routing params
// //api/users/:id - http://localhost:3000/api/users/1
// app.get("/api/v1/users", (req: Request, res: Response) => {
//   res.send(userData);
// });

// // Routing parameters to get a particular user by id
// app.get("/api/v1/users/:id", (req: Request, res: Response) => {
//   //access the param name using re.params.id
//   const userID: string = req.params?.id ?? "";
//   //we need to parse the string to int
//   const parseedID: number = parseInt(userID, 10);

//   //we will use .find() - returns based on the argument passed
//   //find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true
//   const foundUser = userData.find((userObj) => userObj.userID === parseedID);
//   if (!foundUser) {
//     res.status(404).json({
//       message: "Data not available",
//     });
//   } else {
//     //return the data found
//     res.status(201).json({
//       message: "User Found",
//       data: foundUser,
//     });
//   }
// });

// //POST Request
// app.post("/api/v1/users", (req: Request, res: Response) => {
//   //lets destrure the income body req
//   //const body = req.body
//   //const userName = req.body.userName
//   const { body } = req;
//   //if the userData is empty, the id will be 1 else we will add 1  to ther length
//   const newID =
//     userData.length > 0 ? userData[userData.length - 1].userID + 1 : 1;

//   //push the object data to userData
//   const newData = { id: newID, ...body };
//   userData.push(newData);

//   res.status(201).json({
//     message: "Successfull post",
//     payload: newData,
//   });
// });

// /**
//  * {
//     "message": "Successfull post",
//     "payload": {
//         "id": 5,
//         "userName": "alamin",
//         "displayName": "alamin254"
//     }
// }
//  */

// //PUT requests - will replace the entire resource,
// // the body has everything even if not modified

// //PATCH - only the fields need to be changed wuill be in the request body
// app.put("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //get the key-values from the req.body
//   const { body } = req;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //update the data object where userIndex matches the parsed id
//     //update the whole object
//     userData[findUserIndex] = { id: parsedID, ...body };
//     //return the status back to client
//     res.send(200);
//   }
// });



// //PATCH - only the fields need to be changed wuill be in the request body
// app.patch("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //get the key-values from the req.body
//   const { body } = req;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //update the data object where userIndex matches the parsed id
//     //update partially
//     userData[findUserIndex] = { ...userData[findUserIndex], ...body };
//     //return the status back to client
//     res.send(200);
//   }
// });



// //delete
// //PATCH - only the fields need to be changed wuill be in the request body
// app.delete("/api/v1/users/:id", (req: Request, res: Response) => {
//   //get the id from the parameter
//   const { id } = req.params;

//   //parse the incoming id from reqq into a string
//   const parsedID = parseInt(id);

//   //find the user to be updated by gettinbg their indexPositin
//   // for example userData[3] =   { userID: 4, userName: "John", displayName: "john254" },
//   // http://localhost:3000/api/v1/users/3
//   const findUserIndex = userData.findIndex(
//     (userObj) => userObj.userID === parsedID
//   );

//   //minial validations
//   if (isNaN(parsedID)) {
//     res.status(400).json({
//       message: "ID not a number",
//     });
//   }
//   //if the user is not available put error
//   // http://localhost:3000/api/v1/users/33
//   else if (findUserIndex === -1) {
//     res.status(404).json({
//       message: "User unavailable",
//     });
//   } else {
//     //use splice to delete from the array
//     userData.splice(findUserIndex, 1)
//     //return the status back to client
//     res.status(200).json({
//       message: "Data deleted successfully"
//     })
//   }
// });


// // Start the server
// app.listen(port, () => {
//   console.log(
//     `[server]: Server TypeScript is running at http://localhost:${port} 😂😂😂😂`
//   );
// });

// /*
// Error: Cannot set headers after they are sent to the client
//     at ServerResponse.setHeader (node:_http_outgoing:659:11)
//     at ServerResponse.header (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:794:10)
//     at ServerResponse.send (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:174:12)
//     at ServerResponse.json (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:278:15)
//     at ServerResponse.send (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\response.js:162:21)
//     at C:\dev\QA-QE\4.Node\5.express\1.queryParams\src\server.ts:55:7
//     at Layer.handle [as handle_request] (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\layer.js:95:5)
//     at next (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\route.js:149:13)
//     at Route.dispatch (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\route.js:119:3)
//     at Layer.handle [as handle_request] (C:\dev\QA-QE\4.Node\5.express\1.queryParams\node_modules\.pnpm\express@4.21.0\node_modules\express\lib\router\layer.js:95:5)


//      if (filter && value) {
//     const filteredData = userData.filter((userObject) => {
//       return (userObject[filter as keyof typeof userObject]?.toString() || "").toLowerCase().includes(value.toLowerCase())
//     })
//     res.send(filteredData)
//   }

//   res.send(userData);
//     its saying I run two request endpoits at the same both the if statement and after if
//     //we need to add an else
//     // try - catch
//     */