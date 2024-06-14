import joi from "joi"
import { errorMessages } from "./comporents/function"
export const commentSchema = joi.object( {
    body: joi.string().required().messages( errorMessages( "nội dung chính phần bình luận " ) ),

    // articles: joi.string().required().messages( errorMessages( "bài viết được bình luận " ) ),
} )