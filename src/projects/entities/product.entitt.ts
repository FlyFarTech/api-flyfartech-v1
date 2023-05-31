import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Produtcs{
   @PrimaryGeneratedColumn('uuid')
   productid:string
   @Column({default:null})
   Country:string
   @Column({default:null})
   Title:string
   @Column({default:null})
   Tag:string
   @Column({default:null})
   Projectlink:string
   @Column({default:null})
   Description:string
   @Column({default:null})
   imagelink:string

}