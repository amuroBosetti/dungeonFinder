var mongoose = require("mongoose");

var dungeonSchema = new mongoose.Schema({
    name: String,
    image: String,
    minLevel: Number,
    maxLevel: Number,
    description: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }]
});

module.exports = mongoose.model("Dungeon", dungeonSchema);
