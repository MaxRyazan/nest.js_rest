import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from "./tag/tag.entity";


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'bestuser',
    database: 'nestjs',
    entities: [TagEntity],
    synchronize: true,
  }), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
