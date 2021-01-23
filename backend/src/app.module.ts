import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { SubModule } from './sub/sub.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    AuthModule,
    PostModule,
    SubModule,
  ],
})
export class AppModule {}
