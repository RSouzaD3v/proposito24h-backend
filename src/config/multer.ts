import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // Armazena em memória, envia direto ao S3
});