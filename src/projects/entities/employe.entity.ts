import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Employee{
   @PrimaryGeneratedColumn('uuid')
   Employeeid:string
   @Column({default:null})
   FullName:string
   @Column({default:null})
   Designation:string
   @Column({default:null})
   imageurl:string
}