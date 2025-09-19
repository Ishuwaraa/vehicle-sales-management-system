import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY!,
    },
    region: process.env.S3_BUCKET_REGION
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME!,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, nextFunc) {
            nextFunc(null, { fieldName: file.fieldname })
        },
        key: function (req, file, nextFunc) {
            nextFunc(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).array('images', 4);

const getArrayOfImageUrls = async (imageArray: string[], expTime: number) => {
    //creating urls parallely
    //.map creates an array of promisses. promise.all waits for all them to resolve or reject    
    const urls = await Promise.all(imageArray.map(async (image) => {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: image
        };
    
        try {
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: expTime }); 
            return url;
        } catch (err) {
            console.log(`Error getting signed URL for image ${image}:`, err);
            throw err;
        }
    }));

    return urls;
}

const deleteImages = async (imageArray: string[]) => {
    await Promise.all(imageArray.map(async (image) => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: image
        }

        try{
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
        } catch (err) {
            console.log('Error deleting image ', image);
            throw err;
        }
    }));
}

export { upload, getArrayOfImageUrls, deleteImages }
