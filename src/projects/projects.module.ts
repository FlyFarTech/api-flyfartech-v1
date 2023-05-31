import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtcs } from './entities/product.entitt';
import { S3Module } from 'src/s3/s3.module';
import { Hero } from './entities/hero.entity';
import { Services } from './entities/services.entity';
import { Contact } from './entities/contact.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Produtcs, Hero, Services, Contact]),S3Module],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
