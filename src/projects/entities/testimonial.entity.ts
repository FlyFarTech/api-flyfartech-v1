import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Testimonial{
   @PrimaryGeneratedColumn('uuid')
   id:string
   @Column({default:null})
   Review:string
   @Column({default:null})
   Description:string
   @Column({default:null})
   FullName:string
   @Column({default:null})
   imageurl:string
   @Column({default:null})
   Designation:string
}