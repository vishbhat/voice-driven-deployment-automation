const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/singup");
const allblogsRouter = require("./routes/allblogs");
const blogsRouter = require("./routes/blogs");
const usersRouter = require("./routes/users");

app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/allblogs", allblogsRouter);
app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on the PORT ${PORT}`);
});