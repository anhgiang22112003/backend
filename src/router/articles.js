import express from "express"
import { authMiddlware } from "../middleware/checkPermission"
import { createArticle, deleteSlug, favorited, getArticlesUser, getTags, getarticles, getslug, locArticles, unfavorited, updateTitle } from "../controller/articles"
import { getFeed } from "../controller/auth"

const router = express.Router()

router.post( "/creat", authMiddlware, createArticle ),
    router.post( "/:slug/favorite", authMiddlware, favorited ),
    router.get( "/locArticles", locArticles ),
    router.get( "/get", getarticles ),
    router.get( "/gettags", getTags ),
    router.get( "/feed", authMiddlware, getFeed ),
    router.get( "/getArticlesUser", authMiddlware, getArticlesUser ),
    router.get( "/getslug/:slug", getslug ),
    router.put( "/updatetitle/:slug", authMiddlware, updateTitle ),
    router.delete( "/deleteSlug/:slug", authMiddlware, deleteSlug ),
    router.delete( "/:slug/favorite", authMiddlware, unfavorited )





export default router