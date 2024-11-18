const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const chatSchema = Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  bidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
  },
  notificationStatus: {
    type: Boolean,
    required: false,
    default: false
  },
  messageReadFrom: {
    type: Boolean,
    required: false,
    default: false
  },
  messageReadTo: {
    type: Boolean,
    required: false,
    default: false
  },
});

module.exports = mongoose.model("Chat", chatSchema);

