import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

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
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            Designation: { type: 'string' },
            FullName: { type: 'string' },
            Review: { type: 'string' },
            Description: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async addtestimonial( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Designation,FullName,Review,Description} =req.body;

      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }
      
      const testimonial  = new Testimonial()
      testimonial.imageurl =imageurl
      testimonial.Review =Review
      testimonial.FullName = FullName
      testimonial.Designation =Designation
      testimonial.Description=Description
      await this.TestimonialRepository.save({...testimonial})
      return res.status(HttpStatus.OK).send({ status: "success", message: "testimonial Added Successfully", })
    }

    @Patch('testimonial/update/:id')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Designation: { type: 'string' },
            FullName: { type: 'string' },
            Review: { type: 'string' },
            Description: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async Updatetestimonial(
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
      
      @Param('id') id: string,
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Designation,FullName,Review,Description} =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }

      const testimonial = await this.TestimonialRepository.findOne({where:{id}}); // Retrieve testimonial by ID instead of UUID

      if (!testimonial) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: "error",
          message: "Testimonial not found",
        });
      }

      testimonial.imageurl =imageurl
      testimonial.Review =Review
      testimonial.FullName = FullName
      testimonial.Designation =Designation
      testimonial.Description=Description
      await this.TestimonialRepository.update({id},{...testimonial})
      return res.status(HttpStatus.OK).send({ status: "success", message: "testimonial update Successfully", })
    }



    @Get('alltestimonial')
    async alltestimonial( @Res() res: Response){
      const alltestimonial = await this.TestimonialRepository.find({})
      return res.status(HttpStatus.OK).send({alltestimonial})  
    }


    @Delete(':id')
    async Deletetestimonial(
       @Param('id') id: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.TestimonialRepository.delete(id)
       return res.status(HttpStatus.OK).json({ message: 'testimonial has deleted' });
    }


    @Post('addemployee')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Designation: { type: 'string' },
            FullName: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async addemployee( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Designation,FullName} =req.body;
        let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }
      const employee  = new Employee()
      employee.imageurl =imageurl
      employee.FullName = FullName
      employee.Designation =Designation
      await this.EmployeeRepository.save({...employee})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Employee Added Successfully", })
    }

    @Patch('employee/update/:Employeeid')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Designation: { type: 'string' },
            FullName: { type: 'string' },

            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async Updateemployee(
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
      
      @Param('Employeeid') Employeeid: string,
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Designation,FullName,Review,Description} =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }

      const employee = await this.EmployeeRepository.findOne({where:{Employeeid}}); // Retrieve testimonial by ID instead of UUID

      if (!employee) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: "error",
          message: "employee not found",
        });
      }

      employee.imageurl =imageurl
      employee.Designation =Designation
      employee.FullName = FullName
      employee.Designation =Designation
      await this.EmployeeRepository.update({Employeeid},{...employee})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Employee update Successfully", })
    }

    @Get('allemployee')
    async allemployee( @Res() res: Response){
      const allprojects = await this.EmployeeRepository.find({})
      return res.status(HttpStatus.OK).send({allprojects})
    }

    
    @Delete(':Employeeid')
    async DeleteEmployee(
       @Param('Employeeid') Employeeid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.EmployeeRepository.delete(Employeeid)
       return res.status(HttpStatus.OK).json({ message: 'Employee has deleted' });
    }


    @Post('AddProject')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Country: { type: 'string' },
            Title: { type: 'string' },
            Tag: { type: 'string' },
            Description: { type: 'string' },
            Projectlink: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async addproduct( 
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{Country, Title, Tag, Projectlink, Description } =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }
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

    @Patch('product/update/:productid')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Country: { type: 'string' },
            Title: { type: 'string' },
            Tag: { type: 'string' },
            Description: { type: 'string' },
            Projectlink: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async Updateproduct(
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
      
      @Param('productid') productid: string,
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Projectlink,Title,Country,Description,Tag} =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }

      const product = await this.ProductRepository.findOne({where:{productid}}); // Retrieve testimonial by ID instead of UUID

      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: "error",
          message: "employee not found",
        });
      }

      product.imagelink =imageurl
      product.Country =Country
      product.Title = Title
      product.Description =Description
      product.Projectlink =Projectlink
      product.Tag =Tag
      await this.ProductRepository.update({productid},{...product})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Employee update Successfully", })
    }

    @Get('allprojects')
    async Allprjoects( @Res() res: Response){
      const allprojects = await this.ProductRepository.find({})
      return res.status(HttpStatus.OK).send({allprojects})
    }


    @Delete(':productid')
    async Deleteproduct(
       @Param('productid') productid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.ProductRepository.delete(productid)
       return res.status(HttpStatus.OK).json({ message: 'Product has deleted' });
    }



    @Post('contact')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'Attachment', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Name: { type: 'string' },
            Description: { type: 'string' },
            Email: { type: 'string' },
            Category: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async Contact( 
      @UploadedFiles()
      file: {
        Attachment?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response){
      const{ Name,Description ,Email,Category} =req.body;
      let imageurl = null;
      if (file.Attachment && file.Attachment.length > 0) {
        imageurl = await this.s3service.Addimage(file.Attachment[0]);
      }
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


    @Delete(':contactid')
    async Deletecontact(
       @Param('contactid') contactid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.ContactRepository.delete(contactid)
       return res.status(HttpStatus.OK).json({ message: 'contact has deleted' });
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


    @Delete(':serviceid')
    async Deleteservice(
       @Param('serviceid') serviceid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.ServicesRepository.delete(serviceid)
       return res.status(HttpStatus.OK).json({ message: 'service has deleted' });
    }



    @Post('Addvideos')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'deployurl', maxCount: 2 },
      { name: 'codeurl', maxCount: 2 },
      { name: 'buildurl', maxCount: 2 },
      { name: 'designurl', maxCount: 2 },
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: { 
          // 👈  field names need to be repeated for swagger
          buildurl: {
            type: 'string',
            format: 'binary',
          },
          deployurl: {
            type: 'string',
            format: 'binary',
          },
          codeurl: {
            type: 'string',
            format: 'binary',
          },
          designurl: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
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


    @Delete(':heroid')
    async Deletehero(
       @Param('heroid') heroid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.HeroRepository.delete(heroid)
       return res.status(HttpStatus.OK).json({ message: 'heroi has deleted' });
    }


    @Post('createblog')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Designation: { type: 'string' },
            Description: { type: 'string' },
            Title: { type: 'string' },
            Category: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async createblog( 
      @UploadedFiles()
      file: {
      imageurl?: Express.Multer.File[]},
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Category, Title,Designation,WrittenBy } =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }
      const blog  = new Blog()
      blog.Category =Category
      blog.imageurl = imageurl
      blog.Title =Title
      blog.Designation =Designation
      blog.WrittenBy =WrittenBy
      await this.BlogRepository.save({...blog})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Blog created Successfully", })
    }


    @Patch('blog/update/:blogid')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'imageurl', maxCount: 2 }]))
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: { 
            Designation: { type: 'string' },
            Description: { type: 'string' },
            Title: { type: 'string' },
            Category: { type: 'string' },
            imageurl: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    async Updateblog(
      @UploadedFiles()
      file: {
        imageurl?: Express.Multer.File[]},
      
      @Param('blogid') blogid: string,
      @Req() req: Request,
      @Body() body,
      @Res() res: Response){
      const{Category,Title,WrittenBy,Designation} =req.body;
      let imageurl = null;
      if (file.imageurl && file.imageurl.length > 0) {
        imageurl = await this.s3service.Addimage(file.imageurl[0]);
      }

      const blog = await this.BlogRepository.findOne({where:{blogid}}); // Retrieve testimonial by ID instead of UUID

      if (!blog) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: "error",
          message: "blog not found",
        });
      }
      blog.imageurl = imageurl;
      blog.Category =Category
      blog.WrittenBy =WrittenBy
      blog.Title = Title
      blog.Designation = Designation
      await this.BlogRepository.update({blogid},{...blog})
      return res.status(HttpStatus.OK).send({ status: "success", message: "Blog update Successfully", })
    }

    @Get('allblog')
    async allblog( @Res() res: Response){
      const allblog = await this.BlogRepository.find({})
      return res.status(HttpStatus.OK).send({allblog})
    }


    @Delete(':blogid')
    async Deleteblog(
       @Param('blogid') blogid: string,
       @Req() req: Request,
       @Res() res: Response) {
       await this.BlogRepository.delete(blogid)
       return res.status(HttpStatus.OK).json({ message: 'blog has deleted' });
    }
}

