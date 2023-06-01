import { Body, Controller, Get, HttpStatus, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Produtcs } from './entities/product.entitt';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { GCSStorageService } from 'src/s3/s3.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Hero } from './entities/hero.entity';
import { Services } from './entities/services.entity';
import { Contact } from './entities/contact.entity';
import { Blog } from './entities/blog.entity';
import { Employee } from './entities/employe.entity';
import { Testimonial } from './entities/testimonial.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    @InjectRepository(Produtcs) private ProductRepository: Repository<Produtcs>,
    @InjectRepository(Hero) private HeroRepository: Repository<Hero>,
    @InjectRepository(Services) private ServicesRepository: Repository<Services>,
    @InjectRepository(Contact) private ContactRepository: Repository<Contact>,
    @InjectRepository(Blog) private BlogRepository: Repository<Blog>,
    @InjectRepository(Employee) private EmployeeRepository: Repository<Employee>,
    @InjectRepository(Testimonial) private TestimonialRepository: Repository<Testimonial>,
    private readonly projectsService: ProjectsService,
    private s3service: GCSStorageService) {}


    @Post('addtestimonial')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
    async addtestimonial( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Designation,FullName,Review,Description} =req.body;
      const imageurl = file.imageurl? await this.s3service.Addimage(file.imageurl[0]):null
      const testimonial  = new Testimonial()
      testimonial.imageurl =imageurl
      testimonial.Review =Review
      testimonial.FullName = FullName
      testimonial.Designation =Designation
      testimonial.Description=Description
      await this.TestimonialRepository.save({...testimonial})
      return res.status(HttpStatus.OK).send({ status: "success", message: "testimonial Added Successfully", })
    }


    @Get('alltestimonial')
    async alltestimonial( @Res() res: Response){
      const alltestimonial = await this.TestimonialRepository.find({})
      return res.status(HttpStatus.OK).send({alltestimonial})  
    }


    @Post('addemployee')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
    async addemployee( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Designation,FullName} =req.body;
      const imageurl = file.imageurl? await this.s3service.Addimage(file.imageurl[0]):null
      const employee  = new Employee()
      employee.imageurl =imageurl
      employee.FullName = FullName
      employee.Designation =Designation
      await this.EmployeeRepository.save({...employee})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Employee Added Successfully", })
    }

    @Get('allemployee')
    async allemployee( @Res() res: Response){
      const allprojects = await this.EmployeeRepository.find({})
      return res.status(HttpStatus.OK).send({allprojects})
    }


    @Post('AddProject')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
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


    @Post('contact')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'Attachment', maxCount: 2 }]))
    async Contact( 
      @UploadedFiles()
      file: {
        Attachment?: Express.Multer.File},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{ Name,Description ,Email,Category} =req.body;
      const imageurl = file.Attachment? await this.s3service.Addimage(file.Attachment[0]):null
      const products  = new Contact()
      products.imagelink =imageurl
      products.Name = Name
      products.Category =Category
      products.Description =Description
      products.Email =Email
      products.Attachment =imageurl
      await this.ContactRepository.save({...products})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Thanks for contacting with us", })
    }
    
    @Get('allcontact')
    async allcontact( @Res() res: Response){
      const allcontact = await this.ContactRepository.find({})
      return res.status(HttpStatus.OK).send({allcontact})
    }

    
    @Post('Addservices')
    async Addservices( 
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{TextField, Title } =req.body;
      const products  = new Services()
      products.Title =Title
      products.TextField =TextField
      await this.ServicesRepository.save({...products})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Services Added Successfully", })
    }
    @Get('allservices')
    async allservices( @Res() res: Response){
      const allservices = await this.ServicesRepository.find({})
      return res.status(HttpStatus.OK).send({allservices})
    }


    @Post('Addvideos')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'deployurl', maxCount: 2 },
      { name: 'codeurl', maxCount: 2 },
      { name: 'buildurl', maxCount: 2 },
      { name: 'designurl', maxCount: 2 },
   ]))
    async addvideos( 
      @UploadedFiles()
      file: {
        codeurl?: Express.Multer.File,
        buildurl?: Express.Multer.File
        designurl?: Express.Multer.File
        deployurl?: Express.Multer.File
       },
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const code = file.codeurl? await this.s3service.Addvideos(file.codeurl[0]):null
      const build = file.buildurl? await this.s3service.Addvideos(file.buildurl[0]):null
      const design = file.designurl? await this.s3service.Addvideos(file.designurl[0]):null
      const deploy = file.deployurl? await this.s3service.Addvideos(file.deployurl[0]):null
      const products  = new Hero()
      products.Build =build
      products.Code=code
      products.Deploy=deploy
      products.Design=design
      await this.HeroRepository.save({...products})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Project Added Successfully", })

    }
    @Get('allvideos')
    async allvideos( @Res() res: Response){
      const allvideos = await this.HeroRepository.find({})
      return res.status(HttpStatus.OK).send({allvideos})
    }


    @Post('createblog')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
    async createblog( 
      @UploadedFiles()
      file: {
      imageurl?: Express.Multer.File},
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Category, Title,Designation,WrittenBy } =req.body;
      const url = file.imageurl? await this.s3service.Addimage(file.imageurl[0]):null
      const blog  = new Blog()
      blog.Category =Category
      blog.imageurl = url
      blog.Title =Title
      blog.Designation =Designation
      blog.WrittenBy =WrittenBy
      await this.BlogRepository.save({...blog})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Blog created Successfully", })
    }

    @Get('allblog')
    async allblog( @Res() res: Response){
      const allblog = await this.BlogRepository.find({})
      return res.status(HttpStatus.OK).send({allblog})
    }
}

