const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const notificationSchema = Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: false,
    default: false,
  },
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
 
 
});

module.exports = mongoose.model("Notification", notificationSchema);

