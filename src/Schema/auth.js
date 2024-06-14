import joi from "joi";

import { errorMessages } from "./comporents/function";

export const authSchema = joi.object( {
    username: joi.string().required().messages( errorMessages( "Tên" ) ),
    email: joi.string().email().required().messages( errorMessages( "email" ) ),
    image: joi.object( {
        uid: joi.string().required().messages( errorMessages( "Uid" ) ),
        url: joi.string().required().messages( errorMessages( "Đường dẫn" ) ),
    } ),
    role: joi.string().required().messages( errorMessages( "quyền" ) ),
} );
