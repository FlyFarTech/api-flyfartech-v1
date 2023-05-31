import { Body, Controller, Get, HttpStatus, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Produtcs } from './entities/product.entitt';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { GCSStorageService } from 'src/s3/s3.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectsController {
  constructor(
    @InjectRepository(Produtcs) private ProductRepository: Repository<Produtcs>,
    private readonly projectsService: ProjectsService,
    private s3service: GCSStorageService) {}

    @Post('AddProject')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 },
   ]))
    async addproduct( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Country, Title, Tag, Projectlink, Description } =req.body;
      const imageurl = file.imageurl? await this.s3service.Addimage(file.imageurl[0]):null
      const products  = new Produtcs()
      products.imagelink =imageurl
      products.Country = Country
      products.Title =Title
      products.Description =Description
      products.Tag =Tag
      products.Projectlink =Projectlink
      await this.ProductRepository.save({...products})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Project Added Successfully", })

    }

    @Get('allprojects')
    async Allprjoects( @Res() res: Response){
      const allprojects = await this.ProductRepository.find({})
      return res.status(HttpStatus.OK).send({allprojects})
    }
}

