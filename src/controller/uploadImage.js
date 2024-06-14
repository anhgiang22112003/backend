import cloudinary from '../config/cloudinary'

export const uploadImage = async ( req, res ) =>
{
    const file = req.file
    if ( !file )
    {
        return res.status( 404 ).json( { error: 'No files were uploaded' } )
    }
    try
    {
        const result = await cloudinary.uploader.upload( file.path )
        console.log( result );
        return res.json( {
            urls: {
                uid: result.public_id,
                url: result.secure_url
            }
        } )

    } catch ( error )
    {
        return res.status( 500 ).json( { error: error.message } );
    }

}
export const uploadImages = async ( req, res ) =>
{
    const files = req.files
    console.log( "files", files );
    if ( !Array.isArray( files ) )
    {
        return res.status( 400 ).json( { error: 'No files were uploaded' } );
    }
    try
    {
        const uploadPromises = files.map( ( file ) =>
        {
            // Sử dụng Cloudinary API để upload file lên Cloudinary
            return cloudinary.uploader.upload( file.path );
        } );
        console.log( 'uploadPromises', uploadPromises )

        // Chờ cho tất cả các file đều được upload lên Cloudinary
        const results = await Promise.all( uploadPromises );
        console.log( results );
        // Trả về kết quả là một mảng các đối tượng chứa thông tin của các file đã upload lên Cloudinary
        const uploadedFiles = results.map( ( result ) => ( {
            url: result.secure_url,
            uid: result.public_id,
        } ) );
        return res.json( { urls: uploadedFiles } );
    } catch ( error )
    {
        return res.status( 500 ).json( { error: error.message } );
    }
}

export const deleteImage = async ( publicId ) =>
{

    try
    {
        const result = await cloudinary.uploader.destroy( publicId );
        return result
    } catch ( error )
    {
        res.status( 500 ).json( { error: error.message || "Error deleting image" } );
    }
};

export const updateImage = async ( req, res ) =>
{

    const file = req.file

    if ( !file )
    {
        return res.status( 404 ).json( { error: 'No files were uploaded' } )
    }

    const publicId = req.params.publicId; // Lấy publicId của ảnh cần cập nhật
    const newImage = file.path // Lấy đường dẫn của ảnh mới 

    try
    {

        // Upload ảnh mới lên Cloudinary và xóa ảnh cũ cùng lúc
        const [ uploadResult, deleteResult ] = await Promise.all( [
            cloudinary.uploader.upload( newImage ),
            cloudinary.uploader.destroy( publicId )
        ] );
        // Trả về kết quả với url và publicId của ảnh mới
        return res.json( {
            urls: {
                url: uploadResult.secure_url,
                uid: uploadResult.public_id
            }
        } );
    } catch ( error )
    {
        console.log( error );
        return res.status( 500 ).json( { error: error.message || "Error updating image" } );
    }
};
