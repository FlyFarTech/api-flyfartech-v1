import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { Produtcs } from './projects/entities/product.entitt';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true, envFilePath: '.env', }),
    TypeOrmModule.forRoot({
      type:'mysql',
      username:"root",
      password: "",
      host: "127.0.0.1",
      database:"flyfartech",
      port:3306,
      entities:[Produtcs],
      autoLoadEntities:true,
      synchronize:true

    }
    ),
    ProjectsModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
