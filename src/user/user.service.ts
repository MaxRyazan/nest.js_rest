import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from "../config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/LoginUserDto";
import { compare } from 'bcrypt'

@Injectable()
export class UserService{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) {}

  async checkNewUser(email: string): Promise<boolean>{
    const userFromDb = this.userRepository.findBy({ email: email, })
    if(userFromDb){
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    return userFromDb === null
  }


  async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
    if(await this.checkNewUser(createUserDto.email)){
      const newUser = new UserEntity();
      Object.assign(newUser, createUserDto);
      return await this.userRepository.save(newUser);
    }
  }

  generateJwt(user: UserEntity): string{
    return sign({
      id: user.id,
      username: user.username,
      email: user.email
    },  JWT_SECRET)
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user : {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'password', 'email', 'bio', 'image'],
      where: { email: loginUserDto.email }
    })
    if(!user){
      throw  new HttpException('Bad credentials', HttpStatus.NOT_FOUND)
    }

    const isPasswordCorrect = await compare(loginUserDto.password, user.password)
    if(!isPasswordCorrect){
      throw  new HttpException('Bad credentials', HttpStatus.NOT_FOUND)
    }

    delete user.password;
    return user;
  }

  findById(id: number): Promise<UserEntity>{
    return this.userRepository.findOne({where:{id}})
  }
}