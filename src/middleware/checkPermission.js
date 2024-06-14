import jwt from "jsonwebtoken"
import Auth from "../model/auth"
export const authMiddlware = async ( req, res, next ) =>
{
    try
    {
        if ( !req.headers.authorization )
        {
            return res.status( 401 ).json( {
                message: "Bạn chưa đăng nhập",
            } );
        }

        const token = req.headers.authorization.split( " " )[ 1 ];
        const decoded = jwt.verify( token, process.env.SECRET_KEY );
        console.log( decoded );

        const user = await Auth.findById( decoded.id );
        if ( !user )
        {
            return res.status( 401 ).json( {
                message: "Người dùng không tồn tại",
            } );
        }

        req.user = user;

        next();
    } catch ( error )
    {
        if ( error instanceof jwt.TokenExpiredError )
        {
            return res.status( 401 ).json( {
                message: "Token đã hết hạn!",
            } );
        } else if ( error instanceof jwt.NotBeforeError )
        {
            return res.status( 401 ).json( {
                message: "Token chưa có hiệu lực!",
            } );
        } else if ( error instanceof jwt.JsonWebTokenError )
        {
            return res.status( 401 ).json( {
                message: "Token không hợp lệ!",
            } );
        }

        console.error( error );
        return res.status( 500 ).json( {
            message: "Đã có lỗi xảy ra!",
        } );
    }
}
export const isAdmin = async ( req, res, next ) =>
{
    const { email } = req.user
    const users = await Auth.findOne( { email } );
    if ( users?.role !== "Admin" )
    {
        res.status( 401 ).json( { message: "bạn không có quyền truy cập  " } );
    } else
    {
        next()
    }
}