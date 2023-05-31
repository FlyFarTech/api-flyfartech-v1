
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { GCSStorageService } from './s3.service';
import { Produtcs } from 'src/projects/entities/product.entitt';


@Module({
  imports: [
  TypeOrmModule.forFeature([Produtcs])],
  controllers: [S3Controller],
  providers: [GCSStorageService],
  exports:[GCSStorageService]
})
export class S3Module {}
