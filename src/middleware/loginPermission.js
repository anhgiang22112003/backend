import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Auth from "../model/auth";
dotenv.config();
export const loginMiddleware = async ( req, res, next ) =>
{
    try
    {
        if ( !req.headers.authorization )
        {
            return res.status( 401 ).json( {
                message: "bạn chưa đăng nhập ",

            } );

        }
        const token = req.headers.authorization.split( " " )[ 1 ];
        const decoded = jwt.verify( token, process.env.SECRET_KEY );
        const user = await Auth.findById( decoded.id );
        if ( !user )
        {
            return res.status( 401 ).json( {
                message: "người dùng không tồn tại ",
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