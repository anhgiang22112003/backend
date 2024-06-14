import express from "express"
import { articlesSchema } from "../Schema/articles";
import ArticleCard from "../model/articleCard";
import slugify from "slugify"
import Auth from "../model/auth";
import removediacritics from "remove-diacritics";

export const createArticle = async ( req, res ) =>
{
    const { _id } = req.user;
    try
    {
        const { error } = articlesSchema.validate( req.body, { abortEarly: false } );
        if ( error )
        {
            return res.status( 400 ).json( {
                message: error.details.map( ( err ) => err.message ),
            } );
        }
        const users = await Auth.findById( _id );
        const imageUrl = users.image.length > 0 ? users.image[ 0 ].url : null;
        const titleWithoutDiacritics = removediacritics( req.body.title ); // Loại bỏ dấu tiếng Việt

        const slug = slugify( titleWithoutDiacritics, { lower: true, remove: /[*+~.()'"!:@,]/g } )
        const titles = await ArticleCard.findOne( { slug: slug } ).populate( 'author', '_id' );
        console.log( titles );
        if ( titles )
        {
            return res.status( 404 ).json( {
                message: "Tiêu đề bài viết đã tồn tại vui lòng viết tiêu đề khác"
            } )
        }// Tạo slug từ tiêu đề
        const articles = await (
            await ArticleCard.create( {
                title: req.body.title,
                body: req.body.body,
                description: req.body.description,
                slug: slug, // Sử dụng slug được tạo từ tiêu đề
                tagList: req.body.tagList,
                author: req.user._id
            } )
        ).populate( "author" );
        res.status( 200 ).json( { articles } );
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
};
export const getarticles = async ( req, res ) =>
{
    try
    {
        const getArticles = await ArticleCard.find().populate( "author" ).sort( { createdAt: -1 } )

        res.status( 200 ).json( {
            getArticles
        } )
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const getslug = async ( req, res ) =>
{
    const { slug } = req.params
    try
    {
        const getslug = await ArticleCard.findOne( { slug } ).populate( "comments" ).populate( "author" )
        console.log( getslug );
        if ( !getslug )
        {
            return res.status( 404 ).json( { message: "không tồn tại slug " } )
        }
        res.status( 200 ).json( { getslug } )
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const updateTitle = async ( req, res ) =>
{
    const { slug } = req.params;
    const { title, description, body } = req.body;
    try
    {
        const slugs = await ArticleCard.findOne( { slug } ).populate( 'author', '_id' );
        if ( !slugs )
        {
            return res.status( 404 ).json( {
                message: "Không tìm thấy slug"
            } );
        }

        if ( !slugs.author._id.equals( req.user._id ) )
        {
            return res.status( 403 ).json( {
                message: 'Bạn không có quyền update bài viết này',
            } );
        }

        if ( title )
        {
            const newSlug = slugify( title, { lower: true, remove: /[*+~.()'"!:@,]/g } );
            const existingSlug = await ArticleCard.findOne( { slug: newSlug } );

            if ( existingSlug && !existingSlug._id.equals( slugs._id ) )
            {
                return res.status( 400 ).json( {
                    message: "Slug đã tồn tại, vui lòng chọn tiêu đề khác"
                } );
            }

            slugs.title = title;
            slugs.slug = newSlug;
        }
        if ( description )
        {
            slugs.description = description;
        }
        if ( body )
        {
            slugs.body = body;
        }
        const article = await slugs.save();
        res.status( 200 ).json( {
            article
        } );
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
};

export const locArticles = async ( req, res ) =>
{
    const { author, tag, limit = 20, offset = 0, favorited } = req.query;

    try
    {
        let query = {};
        if ( tag )
        {
            query.tagList = tag;
        }
        if ( author )
        {
            // Sử dụng populate để lấy thông tin tác giả
            query[ 'author' ] = await Auth.findOne( { username: author } ).select( '_id' );
        }
        if ( favorited )
        {
            const user = await Auth.findOne( { username: favorited } );
            if ( user )
            {
                query._id = { $in: user.favorites };
            } else
            {
                query._id = { $in: [] };
            }
        }

        // Truy vấn bài viết và populate tác giả
        const articles = await ArticleCard.find( query )
            .sort( { createdAt: -1 } )
            .limit( Number( limit ) )
            .skip( Number( offset ) )
            .populate( 'author', 'username' )
            .exec();

        const articlesCount = await ArticleCard.countDocuments( query );

        res.json( { articles, articlesCount } );
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
};
export const deleteSlug = async ( req, res ) =>
{
    const { slug } = req.params;
    try
    {
        const removeSlug = await ArticleCard.findOne( { slug } ).populate( 'author', '_id' );
        if ( !removeSlug )
        {
            return res.status( 404 ).json( {
                message: 'Không tìm thấy bài viết với slug này',
            } );
        }
        console.log( !removeSlug.author._id.equals( req.user._id ) );
        if ( !removeSlug.author._id.equals( req.user._id ) )
        {
            return res.status( 403 ).json( {
                message: 'Bạn không có quyền xóa bài viết này',
            } );
        }
        await ArticleCard.findOneAndDelete( { slug } );

        res.status( 200 ).json( {
            message: 'Xóa thành công bài viết',
        } );
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: 'Lỗi server: ' + error.message,
        } );
    }
};
export const favorited = async ( req, res ) =>
{
    const { slug } = req.params;
    const { _id } = req.user;

    try
    {
        // Tìm bài viết theo slug
        const slugs = await ArticleCard.findOne( { slug } );
        if ( !slugs )
        {
            return res.status( 404 ).json( {
                message: "Không tìm thấy slug"
            } );
        }

        // Tìm người dùng theo ID
        const user = await Auth.findById( _id );

        // Kiểm tra xem người dùng đã yêu thích bài viết chưa
        if ( !user.favorites.includes( slugs._id ) )
        {
            // Nếu chưa, thêm bài viết vào danh sách yêu thích
            user.favorites.push( slugs._id );
            await user.save();

            // Tăng số lượng yêu thích của bài viết
            slugs.favoritesCount = ( slugs.favoritesCount || 0 ) + 1;
            slugs.favorited = true;
            await slugs.save();

            res.status( 200 ).json( {
                message: "Đã yêu thích bài viết",
                slugs
            } );
        } else
        {
            // Nếu đã yêu thích trước đó, trả về thông báo thích hợp
            res.status( 400 ).json( {
                message: "Bạn đã thích bài viết này trước đó",
            } );
        }
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
};
export const unfavorited = async ( req, res ) =>
{
    const { slug } = req.params
    const { _id } = req.user
    try
    {
        const article = await ArticleCard.findOne( { slug } )
        if ( !article )
        {
            return res.status( 400 ).json( {
                message: "không tìm thấy slug"
            } )
        }
        const user = await Auth.findById( _id );
        if ( !user.favorites.includes( article._id ) )
        {
            return res.status( 400 ).json( {
                message: "bạn chưa yêu thích bài viết này "
            } )
        }
        user.favorites = user.favorites.filter( id => !id.equals( article._id ) );
        await user.save();
        article.favorited = false;
        article.favoritesCount = Math.max( ( article.favoritesCount || 0 ) - 1, 0 );
        await article.save();
        res.status( 200 ).json( { message: "đã hủy yêu thích", article } );

    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const getTags = async ( req, res ) =>
{
    try
    {
        const articles = await ArticleCard.find( {}, 'tagList' );
        const tags = articles.reduce( ( acc, article ) =>
        {
            acc.push( ...article.tagList );
            return acc;
        }, [] );
        const uniqueTags = [ ...new Set( tags ) ]; // Loại bỏ các thẻ trùng lặp
        res.status( 200 ).json( { tags: uniqueTags } );
    } catch ( error )
    {
        res.status( 500 ).json( {
            message: 'Lỗi server: ' + error.message,
        } );
    }
}
export const getArticlesUser = async ( req, res ) =>
{
    const { _id } = req.user
    try
    {
        const article = await ArticleCard.find( { author: _id } )
        console.log( article );
        res.status( 200 ).json(
            article
        )
    } catch ( error )
    {
        res.status( 500 ).json( {
            message: 'Lỗi server: ' + error.message,
        } );
    }
}