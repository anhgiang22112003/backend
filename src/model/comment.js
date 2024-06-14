import mongoose, { Schema } from "mongoose";
const Comment = new mongoose.Schema( {
    body: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    articles: [ { type: mongoose.Schema.Types.ObjectId, ref: "ArticleCard" } ],
    author: {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: String
        },
        bio: {
            type: String,
        },
        image: {
            type: String,
        },
        follow: {
            type: Boolean
        }
    },
}, { timestamps: true, versionKey: false } )
export default mongoose.model( "Comment", Comment )