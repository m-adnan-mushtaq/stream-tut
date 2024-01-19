const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0/delDB");
// Function to find all users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

async function findAllUsers() {
  try {
    const users = await User.find().orFail("faild to find"); // Using the find method to get all users
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    throw error;
  }
}

// Example usage
findAllUsers()
  .then((users) => {
    console.log("All Users:", users);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
