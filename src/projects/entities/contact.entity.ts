
import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

const crypto = require('crypto');
const secretKey = 'my-secret-key';
const maxValue = 10000;

@Entity()
export class Contact{
   @PrimaryGeneratedColumn('uuid')
   contactid:string
   @BeforeInsert()
   async generateUniqueRandomNumber() {
     const timestamp = new Date().toISOString();
     const data = `${timestamp}-${secretKey}`;
     const hash = crypto.createHash('sha256').update(data).digest('hex');
     const randomNumber = parseInt(hash, 16) % maxValue;
     this.contactid = `FFLU${randomNumber.toString().padStart(4, '0')}`;
   }

   @Column({default:null})
   Category:string
   @Column({default:null})
   Name:string
   @Column({default:null})
   Email:string
   @Column({default:null})
   Attachment:string
   @Column({default:null})
   Description:string
   @Column({default:null})
   imagelink:string

}