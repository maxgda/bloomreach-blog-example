import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ITag } from 'app/entities/tag/tag.model';
import { PublicationStatus } from 'app/entities/enumerations/publication-status.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: string;
  date?: dayjs.Dayjs;
  status?: PublicationStatus;
  user?: IUser | null;
  tags?: ITag[] | null;
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public date?: dayjs.Dayjs,
    public status?: PublicationStatus,
    public user?: IUser | null,
    public tags?: ITag[] | null
  ) {}
}

export function getPostIdentifier(post: IPost): number | undefined {
  return post.id;
}
