import { ref } from "joi";
import mongoose, { Schema } from "mongoose";
const ArticleCard = new mongoose.Schema( {
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    tagList: {
        type: [ String ],
        default: [],
    },
    favorited: {
        type: Boolean,
        default: false,

    },
    favoritesCount: {
        type: Number,
        default: 0,

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    comments: [ { type: Schema.Types.ObjectId, ref: "Comment" } ],
    author: { type: Schema.Types.ObjectId, ref: "Auth" },
}, { timestamps: true, versionKey: false }
)
export default mongoose.model( "ArticleCard", ArticleCard )