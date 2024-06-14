import express from "express"
import jwt from "jsonwebtoken"
import { registerSchema } from "../Schema/register";
import bcrypt from "bcrypt"
import Auth from "../model/auth";
import { config } from "dotenv";
import { loginSchema } from "../Schema/login";
import ArticleCard from "../model/articleCard";
config();

export const Login = async ( req, res ) =>
{
    try
    {
        const { email, password } = req.body;
        const { error } = loginSchema.validate( req.body, { abortEarly: false } );
        if ( error )
        {
            return res.status( 400 ).json( {
                message: error.details.map( ( err ) => err.message )
            } )
        }
        const user = await Auth.findOne( { email } );
        if ( !user )
        {
            return res.status( 404 ).json( {
                message: "tài khoản hoặc mật khẩu không đúng"
            } )
        }
        const passwordHash = await bcrypt.compare( password, user.password );
        if ( !passwordHash )
        {
            return res.status( 404 ).json( {
                message: "Tài khoản hoặc mật khẩu không đúng",
            } );
        }
        const token = jwt.sign( { id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" } );
        user.password = undefined
        return res.status( 200 ).json( {
            message: "đăng nhập thành công ",
            user,
            token: token
        } )
    } catch ( error )
    {
        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const register = async ( req, res ) =>
{
    try
    {
        const { error } = registerSchema.validate( req.body, { abortEarly: false } );
        if ( error )
        {
            const errors = error.details.map( ( err ) => err.message )
            return res.status( 400 ).json( {
                message: errors
            } )
        }
        const email = await Auth.findOne( { email: req.body.email } );
        if ( email )
        {
            return res.status( 404 ).json( {
                message: "email đã tồn tại vui lòng đăng kí bằng email khác"
            } )
        }
        const username = await Auth.findOne( { username: req.body.username } );

        if ( username )
        {
            return res.status( 404 ).json( {
                message: "username đã tồn tại vui lòng đăng kí bằng username khác"
            } )
        }
        const passwordHash = await bcrypt.hash( req.body.password, 12 );
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: passwordHash,

        }
        const data = await Auth.create( user );
        data.password = undefined
        if ( !data )
        {
            return res.status( 404 ).json( { message: "Đăng ký thất bại" } );
        }
        const token = jwt.sign(
            {
                email: req.body.email,

            },
            process.env.SECRET_KEY
        );
        return res.status( 200 ).json( {
            message: "Đăng ký tài khoản thành công",
            data: data,
            token: token
        } );
    } catch ( error )
    {
        console.log( error );

        return res.status( 500 ).json( {
            message: "Lỗi server: " + error.message,
        } );
    }
}
export const getuser = async ( req, res ) =>
{
    const { _id } = req.user
    try
    {
        const user = await Auth.findOne( { _id: _id } ).populate( "following" )
        res.status( 200 ).json( {
            user
        } )

    } catch ( error )
    {
        throw new Error( error )
    }
}
export const updateuser = async ( req, res ) =>
{
    const { _id } = req.user;
    const { email, bio, username } = req.body;

    try
    {
        const existingUser = await Auth.findOne( { email: email } );
        const existinguser = await Auth.findOne( { username: username } );

        const currentUser = await Auth.findById( _id );

        if ( currentUser.email !== email )
        {
            if ( existingUser && existingUser._id.toString() !== _id )
            {
                return res.status( 400 ).json( { message: "Email đã tồn tại trong hệ thống." } );
            }
            currentUser.email = email;
        }
        if ( currentUser.username !== username )
        {
            if ( existinguser && existinguser._id.toString() !== _id )
            {
                return res.status( 400 ).json( { message: "username đã tồn tại trong hệ thống." } );
            }
            currentUser.username = username;
        }


        currentUser.username = username;
        currentUser.bio = bio;

        // Xử lý ảnh upload nếu có
        console.log( req.file );
        if ( req.file )
        {
            const imageUrl = req.file.path;
            const imageUid = req.file.filename;
            currentUser.image = [ { uid: imageUid, url: imageUrl } ];
        }

        const updatedUser = await currentUser.save();

        res.status( 200 ).json( {
            message: "Cập nhật thành công",
            user: updatedUser,
        } );
    } catch ( error )
    {
        console.log( error );
        return res.status( 500 ).json( {
            message: "Lỗi server " + error.message,
        } );
    }
};
export const profile = async ( req, res ) =>
{
    const { username } = req.params;
    try
    {
        const profiles = await Auth.findOne( { username } ).populate( "following" )
        if ( !profiles )
        {
            return res.status( 401 ).json( {
                message: "hồ sơ không tồn tại"
            } )
        }


        // const imageUrl = profiles.image.length > 0 ? profiles.image[ 0 ].url : null;
        // const profile = {
        //     username: profiles.username,
        //     bio: profiles.bio,
        //     email: profiles.email,
        //     image: imageUrl,
        //     follow: profiles.follow,
        // };
        res.status( 200 ).json( { profiles } );

    } catch ( error )
    {
        console.error( error );
        res.status( 500 ).json( { message: "Lỗi server " + error.message } );

    }
}
export const profileUser = async ( req, res ) =>
{
    const { username } = req.params;
    try
    {
        const profiles = await Auth.findOne( { username } )
        if ( !profiles )
        {
            return res.status( 401 ).json( {
                message: "hồ sơ không tồn tại"
            } )
        }


        // const imageUrl = profiles.image.length > 0 ? profiles.image[ 0 ].url : null;
        // const profile = {
        //     username: profiles.username,
        //     bio: profiles.bio,
        //     email: profiles.email,
        //     image: imageUrl,
        //     follow: profiles.follow,
        // };
        res.status( 200 ).json( { profiles } );

    } catch ( error )
    {
        console.error( error );
        res.status( 500 ).json( { message: "Lỗi server " + error.message } );

    }
}
export const following = async ( req, res ) =>
{
    const { username } = req.params;
    const userId = req.user._id

    try
    {
        const follows = await Auth.findOne( { username } );
        if ( !follows )
        {
            return res.status( 404 ).json( { error: 'người dùng không tồn tại' } );
        }
        const currentUser = await Auth.findById( userId );
        if ( !currentUser )
        {
            return res.status( 404 ).json( { error: 'Không tìm thấy người dùng hiện tại' } );
        }
        if ( currentUser.following.includes( follows._id ) )
        {
            return res.status( 400 ).json( { error: 'Bạn đã theo dõi người dùng này' } );
        }
        currentUser.following.push( follows._id );
        await currentUser.save();

        follows.follow = true;
        await follows.save();

        res.status( 200 ).json( {
            follows
        } )

    } catch ( error )
    {
        res.status( 500 ).json( { error: 'An error occurred while following the user' } );

    }
}
export const unfollow = async ( req, res ) =>
{
    const { username } = req.params
    const userId = req.user._id
    try
    {
        const unfollow = await Auth.findOne( { username } )
        if ( !unfollow )
        {
            return res.status( 404 ).json( { error: 'người dùng không tồn tại' } );

        }
        const userIds = await Auth.findById( userId );
        if ( !userIds )
        {
            return res.status( 404 ).json( { error: "không tìm thấy người dùng hiện tại" } )
        }
        //kiểm tra xem đã theo dõi trước đó hay chưa 
        if ( !userIds.following.includes( unfollow._id ) )
        {
            return res.status( 400 ).json( { error: 'Bạn không theo dõi người dùng này' } );
        }
        userIds.following = userIds.following.filter( id => !id.equals( unfollow._id ) );
        await userIds.save();

        unfollow.follow = false;
        await unfollow.save();
        res.json( { profile: unfollow } );

    } catch ( error )
    {
        res.status( 500 ).json( { error: 'An error occurred while unfollowing the user' } );

    }
}
export const getFeed = async ( req, res ) =>
{
    const { limit = 20, offset = 0 } = req.query;
    const user = req.user;
    console.log( user );
    try
    {
        const following = user.following;
        if ( following.length === 0 )
        {
            return res.status( 200 ).json( { articles: [], articlesCount: 0 } );

        }
        const article = await ArticleCard.find( { author: { $in: following } } ).sort( { createdAt: -1 } ).limit( parseInt( limit ) ).skip( parseInt( offset ) ).populate( 'author', 'username bio image' );
        const articlesCount = await ArticleCard.countDocuments( { author: { $in: following } } )
        res.status( 200 ).json( { article, articlesCount } );

    } catch ( error )
    {
        res.status( 500 ).json( { message: 'Lỗi server: ' + error.message } );
    }
}