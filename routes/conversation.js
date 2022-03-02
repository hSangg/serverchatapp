const router = require("express").Router()
const Conversation = require("../models/Conversation")

router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body
  const newConersation = new Conversation({
    members: [senderId, receiverId],
  })
  try {
    await newConersation.save()
    res.status(200).json({ success: true, conversation: newConersation })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId

  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    })
    res.status(200).json({ success: true, conversation })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

module.exports = router
