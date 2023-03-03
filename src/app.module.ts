import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TagModule } from "./tag/tag.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "./tag/tag.entity";
import { UserModule } from "./user/user.module";
import { UserEntity } from "./user/user.entity";
import { AuthMiddleware } from "./user/middlewares/auth.middleware";


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'bestuser',
    database: 'nestjs',
    entities: [TagEntity, UserEntity],
    synchronize: true,
  }), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
