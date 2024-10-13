import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// It is use to configure the cors and "use" method is used in middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Express directly accepts json and provide various other features such as limits is common
app.use(
  express.json({
    limit: "16kb",
  })
);

//Form Data coming from url which is able to parse nested objects with "extended:true" value
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Configure to store data such as file,pdf,image on server in a folder mentioned in ""
app.use(express.static("public"));

// Configuring Cookies parser to access the cookies of the browser and perform CRUD operation
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";
// Routes declaration
app.use("/api/v1/users",userRouter)

// http://loalhost:8000/api/v1/users/register


export { app };
