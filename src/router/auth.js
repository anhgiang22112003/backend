import express from "express"
import { Login, following, getuser, profile, profileUser, register, unfollow, updateuser } from "../controller/auth"
import { authMiddlware } from "../middleware/checkPermission";
import upload from "../config/cloudinary";

const router = express.Router()
router.post( "/register", register );
router.post( "/login", Login );
router.get( "/getuser", authMiddlware, getuser );
router.put( "/updateUser", authMiddlware, upload.single( 'image' ), updateuser );
router.get( "/profile/:username", authMiddlware, profile )
router.get( "/profileUser/:username", authMiddlware, profileUser )

router.post( "/profile/:username/follow", authMiddlware, following )
router.delete( "/profile/:username/unfollow", authMiddlware, unfollow )




export default router