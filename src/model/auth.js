import { boolean } from "joi";
import mongoose, { Schema } from "mongoose";
const Auth = new mongoose.Schema( {
    email: {
        type: Schema.Types.String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    image: [
        {
            uid: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    ],

    bio: {
        type: String
    },
    follow: {
        type: Boolean,
        default: false,
    },
    favorites: [ { type: Schema.Types.ObjectId, ref: 'ArticleCard' } ],

    following: [ {
        type: Schema.Types.ObjectId,
        ref: 'Auth'
    } ],
    role: {
        type: String,
        enum: [ "User", "Admin" ],
        default: "User",
    },
}, { timestamps: true, versionKey: false } );
export default mongoose.model( "Auth", Auth );