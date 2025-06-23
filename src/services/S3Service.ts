import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type UploadParams = {
  fileBuffer: Buffer;
  fileName: string;
  mimetype: string;
  folder: 'avatars' | 'cover-books-image'; // Tipo para restringir os diretórios
};

export const uploadToS3 = async ({ fileBuffer, fileName, mimetype, folder }: UploadParams): Promise<string> => {
  // Criação de um identificador único para o arquivo
  const key = `${folder}/${uuidv4()}-${fileName}`;

  // Comando para enviar o arquivo para o S3
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  // Envia o comando para o S3
  await s3.send(command);

  // Geração do URL público do arquivo no S3
  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return fileUrl;
};
