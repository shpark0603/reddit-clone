import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { BaseContent } from '../base-content.entity';

@Entity()
export class Comment extends BaseContent {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  usename: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;
}
