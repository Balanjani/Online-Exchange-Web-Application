const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "";
    // console.log('uri', uri)
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");

  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;




//
// 223.178.213.120

// apptestp40325
// MeRqZXmCXm1osG5v