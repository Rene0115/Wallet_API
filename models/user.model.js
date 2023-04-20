import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const nigeriaOffset = 60 * 60 * 1000 * 1;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  profilePhoto: {
    type: String
  },
  phone: {
    type: Number
  },
  transactions: [
    {
      transaction_type: {
        type: String,
        enum: ["debit", "credit"]
      },
      transaction_amount: {
        type: Number
      },
      transaction_date: {
        type: Date,
        default: Date.now
      }
    }
  ]
},{timestamps: { currentTime: () => Date.now() + nigeriaOffset },versionKey: false});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { _id: this._id, username: this.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME
      }
    );
  };
  
  UserSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  };


  const UserModel = mongoose.model('User', UserSchema);

  export default UserModel;