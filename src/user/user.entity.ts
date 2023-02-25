import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {hash} from 'bcrypt'

@Entity({name: 'users'})
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: false})
  username: string;

  @Column({nullable: false})
  email: string

  @Column({default: ''})
  bio: string

  @Column({default: ''})
  image: string

  @Column({nullable: false})
  password: string

  @BeforeInsert()
  async hashPassword(){
    this.password = await hash(this.password, 10)
  }

}