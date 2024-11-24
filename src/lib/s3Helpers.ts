import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp';

// Initialize the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const uploadProductToS3 = async (file: File): Promise<string> => {
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const uploadsPath = `uploads/${uniqueFileName}`;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Only images are allowed.');
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); //

    // Resize the image if it's too large
    const resizedBuffer = await sharp(buffer)
        .resize({ width: 600, height: 600, fit: 'inside' })
        .toBuffer();

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: uploadsPath,
        Body: resizedBuffer,
        ContentType: file.type,
        ACL: 'public-read',
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadsPath}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
};

export const deleteFromS3 = async (fileUrl: string) => {
    const fileName = fileUrl.split('/').pop();
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/${fileName}`,
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        // console.log(`Deleted file: ${fileUrl}`);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};
