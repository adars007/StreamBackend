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
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
export { app };
