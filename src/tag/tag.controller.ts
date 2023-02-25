import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { TagService } from './tag.service';
import { TagEntity } from "./tag.entity";


@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(@Res() response): Promise<TagEntity[]> {
    const tags = await this.tagService.findAll();
    return response.status(HttpStatus.OK).json({ tags })
  }


//   @Get()
//   async findAll(): Promise<{ tags: string[] }>{
//     const tags = await this.tagService.findAll();
//     return  {
//       tags: tags.map(tag => tag.name)
//     };
//   } // если нужно отдать только названия тегов, без айди
// }

}