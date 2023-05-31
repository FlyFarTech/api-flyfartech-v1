import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtcs } from './entities/product.entitt';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[TypeOrmModule.forFeature([Produtcs]),S3Module],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
