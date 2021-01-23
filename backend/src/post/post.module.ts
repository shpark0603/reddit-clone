import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilModule } from 'src/util/util.module';
import { Sub } from '../sub/sub.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Sub]), UtilModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
