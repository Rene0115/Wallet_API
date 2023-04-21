import userModel from "../models/user.model.js";
import { uploadImage } from "../config/cloudinary.config.js";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import dotenv from 'dotenv';

dotenv.config();

class UserController {
 async signup(req, res) {

    const image = await uploadImage(req.file.path)
    const imageUrl = image.url
    const data = {
        email: req.body.email,
        firstname: req.body.firstname,
        username: req.body.username,
        lastname: req.body.lastname,
        password: req.body.password,
        phone: req.body.phone,
        image: imageUrl
       }
       if (!data.email || !data.password || !data.phone || !data.firstname || !data.username || !data.lastname) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            success: false,
            message: 'Must provide email, password, phone number, username, firstname and lastname'
        })
       }
       const userExists = await userModel.findOne({email: data.email})
       if (!(_.isEmpty(userExists))) {
         return res.status(StatusCodes.NOT_ACCEPTABLE).send({
            success: false,
            message: 'User with this email already exists'
         })
       }
       const user = await userModel.create(data);
    if (!user) {
        return res.status(StatusCodes.EXPECTATION_FAILED).send({
            success: false,
            message:'Unable to create user'
        })
    }

    return res.status(StatusCodes.CREATED).send({
        success: true,
        data: user,
        imageUrl
    })
 }
}


export default new UserController();