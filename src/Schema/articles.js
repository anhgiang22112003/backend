import joi from "joi";

import { errorMessages } from "./comporents/function";

export const articlesSchema = joi.object( {
    title: joi.string().required().messages( errorMessages( "Tiêu đề" ) ),
    description: joi.string().required().messages( errorMessages( "chi tiết " ) ),
    body: joi.string().required().messages( errorMessages( "nội dung chính bài viết " ) ),
    // author: joi
    //     .string()
    //     .required()
    //     .messages( errorMessages( "người đăng" ) ),
    tagList: joi.array().items( joi.string() ).messages( errorMessages( "tagList" ) ),

} );
