"use strict";

var mongoose = require('mongoose');

function initial() {// Your initialization code here
}

mongoose.connect("mongodb://127.0.0.1:27017/Mwencha", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Successfully connect to MongoDB.");
  initial(); // Call your initialization function here
})["catch"](function (err) {
  console.error("Connection error", err);
  process.exit(1); // Exit the application on connection error
});
//# sourceMappingURL=db.config.dev.js.map
