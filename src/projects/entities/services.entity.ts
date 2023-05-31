import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Services{
   @PrimaryGeneratedColumn()
   serviceid:string
   @Column({default:null})
   Title:string
   @Column({default:null})
   TextField:string
   @Column({default:null})
   CustomerCount:string
}