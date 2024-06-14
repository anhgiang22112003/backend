import joi from 'joi'
import { errorMessages } from "./comporents/function";

export const registerSchema = joi.object( {
    username: joi.string().required().messages( errorMessages( "Tên" ) ),
    email: joi.string().email().required().messages( errorMessages( "Email" ) ),
    password: joi.string().required().min( 6 ).messages( errorMessages( "Mật khẩu" ) ),
    confirmPassword: joi
        .string()
        .valid( joi.ref( "password" ) )
        .required()
        .messages( errorMessages( "Xác nhận mật khẩu" ) ),
} );