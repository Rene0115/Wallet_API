import userModel from "../models/user.model.js";
import { uploadImage } from "../config/cloudinary.config.js";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

class UserController {
  async signup(req, res) {
    let imageUrl = null;
    if (req.file && req.file.path) {
      const image = await uploadImage(req.file.path);
      imageUrl = image.url;
    }
    const data = {
      email: req.body.email,
      firstname: req?.body.firstname,
      username: req?.body.username,
      lastname: req?.body.lastname,
      password: req.body.password,
      phone: req?.body.phone,
      profilePhoto: imageUrl
    };
    if (!data.email || !data.password) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "Must provide email, password"
      });
    }
    const userExists = await userModel.findOne({ email: data.email });
    // const usernameExists = await userModel.findOne({ username: data.username });
    if (!_.isEmpty(userExists)) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send({
        success: false,
        message: "User with this email or username already exists"
      });
    }
    const user = await userModel.create(data);
    if (!user) {
      return res.status(StatusCodes.EXPECTATION_FAILED).send({
        success: false,
        message: "Unable to create user"
      });
    }

    return res.status(StatusCodes.CREATED).send({
      success: true,
      data: { ...user.toObject(), password: undefined }
    });
  }
  async login(req, res) {
    const data = {
      username: req?.body.username,
      email: req?.body.email,
      password: req.body.password
    };

    if ((!data.username && !data.email) || !data.password) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: `Must provide a username or email and password`
      });
    }
    const user = await userModel.findOne({
      $or: [{ email: data.email }, { username: data.username }]
    });

    if (_.isEmpty(user)) {
      return res.status(StatusCodes.NOT_FOUND).send({
        success: false,
        message: `User with this email or username does not exist`
      });
    }

    const comparePass = user.comparePassword(data.password);
    if (!comparePass) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: `Invalid Credentials`
      });
    }

    const token = user.createJWT();
    user.password = undefined;

    return res.status(StatusCodes.OK).send({
      success: true,
      data: user,
      token
    });
  }
}

export default new UserController();
