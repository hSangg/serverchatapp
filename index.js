const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const port = process.env.PORT || 5000

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const postRoute = require("./routes/post")
const uploadRoute = require("./routes/upload")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")

const app = express()
dotenv.config()

app.use("/images", express.static(path.join(__dirname, "public/images")))

//middleware
app.use(express.json())
app.use(cors())

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

// @socket io

//connect mongoose
mongoose.connect(
  "mongodb+srv://sang:sang@chat.e2w5l.mongodb.net/chat?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("MONGOOSE CONNECTED")
  }
)

//routes
app.use("/api/auth", authRoute)
app.use("/api/upload", uploadRoute)
app.use("/api/post", postRoute)
app.use("/api/user", userRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)

app.listen(port, () => {
  console.log("SERVER START ON 8000")
})
