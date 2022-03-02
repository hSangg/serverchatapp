const router = require("express").Router()
const Message = require("../models/Message")

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body)

  try {
    await newMessage.save()
    res.status(200).json({ success: true, message: newMessage })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get("/:conversationId", async (req, res) => {
  const id = req.params.conversationId
  try {
    const message = await Message.find({
      conversationId: id,
    })
    res.status(200).json({ success: true, message: message })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

module.exports = router
