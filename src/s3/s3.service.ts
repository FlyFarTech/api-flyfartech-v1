require('dotenv').config();
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { Storage } from '@google-cloud/storage';
import { Produtcs } from 'src/projects/entities/product.entitt';
const fs = require('fs');

@Injectable()
export class GCSStorageService  {
    constructor(
        @InjectRepository(Produtcs) private productRepo: Repository<Produtcs>) {}

        async Addimage(file: Express.Multer.File) {
            const serviceAccountKeyFile = 's3config.json';
            process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountKeyFile;
            const storage = new Storage({ keyFilename: serviceAccountKeyFile });
            const bucketName = 'cdn.flyfarladies.com'; // Replace with your actual bucket name
            const bucket = storage.bucket(bucketName);
            const fileName = `${file.originalname}.webp`;
            const fileObject = bucket.file(fileName);
          
            try {
              const imageBuffer = await sharp(file.buffer).webp().toBuffer();
              await fileObject.save(imageBuffer, {
                contentType: 'image/webp',
                public: true,
                validation: 'md5',
              });
          
              const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
              console.log(`File uploaded successfully to ${fileUrl}`);
              return fileUrl;
            } catch (err) {
              console.error('Error uploading file to Google Cloud Storage:', err);
              throw err;
            }
          }


          async Addvideos(file: Express.Multer.File) {
            const serviceAccountKeyFile = 's3config.json';
            process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountKeyFile;
            const storage = new Storage({ keyFilename: serviceAccountKeyFile });
            const bucketName = 'cdn.flyfarladies.com'; // Replace with your actual bucket name
            const bucket = storage.bucket(bucketName);
            const fileName = `${file.originalname}`;
            const fileObject = bucket.file(fileName);
          
            try {
            
              await fileObject.save(file.buffer, {
                contentType: 'video/mp4',
                public: true,
                validation: 'md5',
              });
          
              const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
              console.log(`File uploaded successfully to ${fileUrl}`);
              return fileUrl;
            } catch (err) {
              console.error('Error uploading file to Google Cloud Storage:', err);
              throw err;
            }
          }
    

    // // update cover image 
    async updateImage(productid: string, file: Express.Multer.File) {
      const project = await this.productRepo.findOne({where:{productid}})
      if (!project) {
        throw new Error('Image not found');
      }

      const serviceAccountKeyFile = 's3config.json';
      process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountKeyFile;
      const storage = new Storage({ keyFilename: serviceAccountKeyFile });
      const bucketName = 'cdn.flyfarladies.com'; // Replace with your actual bucket name
      const bucket = storage.bucket(bucketName);
      const fileName = `${file.originalname}.webp`;
      const fileObject = bucket.file(fileName);
      try {
        const imageBuffer = await sharp(file.buffer).webp().toBuffer();
        await fileObject.save(imageBuffer, {
          contentType: 'image/webp',
          public: true,
          validation: 'md5',
        });
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}new Date().getTime()`;
        console.log(`File uploaded successfully to ${imageUrl}`);
        return imageUrl;
      } catch (err) {
        console.error('Error uploading file to Google Cloud Storage:', err);
        throw err;
      }

    }

}
