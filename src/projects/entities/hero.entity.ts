import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

const crypto = require('crypto');
const secretKey = 'my-secret-key';
const maxValue = 10000;


@Entity()
export class Hero{
   @PrimaryGeneratedColumn('uuid')
   heroid:string
   @BeforeInsert()
   async generateUniqueRandomNumber() {
     const timestamp = new Date().toISOString();
     const data = `${timestamp}-${secretKey}`;
     const hash = crypto.createHash('sha256').update(data).digest('hex');
     const randomNumber = parseInt(hash, 16) % maxValue;
     this.heroid = `FFLU${randomNumber.toString().padStart(4, '0')}`;
   }
   @Column({default:null})
   Design:string
   @Column({default:null})
   Code:string
   @Column({default:null})
   Build:string
   @Column({default:null})
   Deploy:string
}