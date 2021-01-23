import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseContent } from '../base-content.entity';

@Entity('users')
export class User extends BaseContent {
  @Column({ unique: true })
  username: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
