const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path");
require("dotenv").config()

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const gigRoute = require("./routes/gigs");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const conversationRoute = require("./routes/conversations");

require("./conn/conn")

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/conversations", conversationRoute);

app.get("/", (req, res) => {
    res.send("Hello World! this is backend")
})
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})