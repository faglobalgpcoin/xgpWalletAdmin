import NoticeStore from './NoticeStore';
import PostWriteStore from './PostWriteStore';
import PostUpdateStore from './PostUpdateStore';

export default {
  noticeStore: new NoticeStore(),
  postWriteStore: new PostWriteStore(),
  postUpdateStore: new PostUpdateStore(),
};
