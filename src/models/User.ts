import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

/* ============================= */
/*        Interfaces             */
/* ============================= */

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "seller" | "buyer";
  addresses: IAddress[];
  refreshToken?: string;

  // instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* ============================= */
/*        Address Schema         */
/* ============================= */

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

/* ============================= */
/*         User Schema           */
/* ============================= */

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["seller", "buyer"],
      default: "buyer",
    },

    addresses: [AddressSchema],

    refreshToken: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

/* ============================= */
/*    Password Hash Middleware   */
/* ============================= */

UserSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

/* ============================= */
/*     Instance Method           */
/* ============================= */

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ============================= */
/*         Export Model          */
/* ============================= */

export default mongoose.model<IUser>("User", UserSchema);