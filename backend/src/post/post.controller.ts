import {
  Body,
  Controller,
  Get,
  Param,
  Post as PostRoute,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @PostRoute()
  @UseGuards(JwtAuthGuard)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<Post> {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  getPosts(): Promise<Post[]> {
    return this.postService.getAllPosts();
  }

  @Get(':identifier/:slug')
  getPost(
    @Param('identifier') identifier: string,
    @Param('slug') slug: string,
  ) {
    return this.postService.getPost(identifier, slug);
  }
}
