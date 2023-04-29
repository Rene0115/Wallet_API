import mongoose from "mongoose";
import { nigeriaOffset } from "./user.model.js";
const transactionSchema = mongoose.Schema({
    transaction_type: {
        type: String,
        enum: ["debit", "credit"]
      },
      transaction_amount: {
        type: Number,
        validate: {
          validator: function (v) {
            return v % 1 === 0 && v > 0;
          },
          message: (props) => `${props.value} is not a positive integer`
        }
      },
      transaction_date: {
        type: Date,
        default: Date.now
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
      }

},
{timestamps: { currentTime: () => Date.now() + nigeriaOffset },
  versionKey: false
})

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;