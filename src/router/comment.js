import express from "express"
import { authMiddlware } from "../middleware/checkPermission"
import { Comments, deleteComment, getComment } from "../controller/comment"
const router = express.Router()


router.post( "/:slug/comment", authMiddlware, Comments )
router.get( "/:slug/comment", getComment )
router.delete( "/:slug/comment/:_id", authMiddlware, deleteComment )

export default router