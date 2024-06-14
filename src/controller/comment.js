import { commentSchema } from "../Schema/comment";
import ArticleCard from "../model/articleCard";
import Comment from "../model/comment";


export const Comments = async ( req, res ) =>
{
    const { slug } = req.params;

    try
    {
        const { error } = commentSchema.validate( req.body, { abortEarly: false } );
        if ( error )
        {
            return res.status( 400 ).json( {
                message: error.details.map( ( err ) => err.message )
            } );
        }
        const Slugs = await ArticleCard.findOne( { slug } );
        if ( !Slugs )
        {
            return res.status( 404 ).json( {
                message: "Không tìm thấy slug"
            } );
        }

        const userId = req.user._id; // Lấy ID của người bình luận từ req.user

        const commentss = await Comment( {
            body: req.body.body,
            author: {
                userId: userId, // Thêm trường userId vào author với giá trị là ID của người dùng
                username: req.user.username,
                bio: req.user.bio,
                follow: req.user.follow,
                image: req.user.image.length > 0 ? req.user.image[ 0 ].url : null
            },
            articles: Slugs._id
        } );
        await commentss.save();
        Slugs.comments = Slugs.comments || [];
        Slugs.comments.push( commentss._id );
        await Slugs.save();
        res.status( 200 ).json( { commentss } );
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message
        } );
    }
};

export const getComment = async ( req, res ) =>
{
    const { slug } = req.params
    try
    {
        const Slugs = await ArticleCard.findOne( { slug } )
        if ( !Slugs )
        {
            return res.status( 400 ).json( {
                message: "không tìm thấy bài viết"
            } )
        }
        const comment = await Comment.find( { articles: Slugs._id } ).sort( { createdAt: -1 } )
        res.json( { comment } )
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const deleteComment = async ( req, res ) =>
{
    const { slug } = req.params
    const { _id } = req.params
    try
    {
        const Slug = await ArticleCard.findOne( { slug } )
        if ( !Slug )
        {
            return res.status( 400 ).json( {
                message: "không tìm thấy slug"
            } )
        }
        const comment = await Comment.findById( _id )
        if ( !comment )
        {
            return res.status( 404 ).json( {
                message: "không tìm thấy comment"
            } )
        }
        if ( req.user._id != comment.author.userId )
        {
            return res.status( 404 ).json( {
                menubar: "bạn không có quyền xóa comment"
            } )
        }
        const remove = await Comment.findByIdAndDelete( _id )
        res.status( 200 ).json( {
            message: "xóa thành công comment!",
            remove
        } )
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}