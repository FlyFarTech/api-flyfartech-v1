import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Blog{
   @PrimaryGeneratedColumn('uuid')
   blogid:string
   @Column({default:null})
   Category:string
   @Column({default:null})
   Title:string
   @Column({default:null})
   imageurl:string
   @Column({default:null})
   WrittenBy:string
   @Column({default:null})
   Designation:string
}