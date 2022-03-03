const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")

//@port
const PORT = process.env.PORT || 5000

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const postRoute = require("./routes/post")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/message")

const app = express()
dotenv.config()

//middleware
app.use(express.json())
app.use(cors({ origin: "http://localhost:3000" }))

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
app.use("/api/post", postRoute)
app.use("/api/user", userRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)

app.listen(PORT, () => {
  console.log("SERVER START ON 8000")
})
