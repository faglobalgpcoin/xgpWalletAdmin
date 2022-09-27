import {action, observable} from 'mobx';
import {patchPostByApi} from '../../apis/notice';
import {decodeCookieData, getCookie} from '../../utils/auth';

class PostUpdateStore {
  auth = {};

  @observable id = '';

  @observable title = '';

  @observable content = '';

  @observable isUsing = false;

  @observable history = {};

  @action setInitialStore = (postId, noticeStore, history) => {
    const {accessToken} = decodeCookieData(getCookie('key'));
    this.auth = {accessToken};
    const post = noticeStore.noticeList.find((i) => i.id === postId);
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.isUsing = !post.deleted;
    this.history = history;
  };

  @action handleChangeTitle = (e) => {
    this.title = e.target.value;
  };

  @action handleChangeContent = (e) => {
    this.content = e.sender.body.innerHTML;
  };

  @action handleCheckboxChange = () => {
    this.isUsing = !this.isUsing;
  };

  @action handleSubmit = async () => {
    const validationResult = this.validationInput();
    if (validationResult) {
      try {
        const post = {
          id: this.id,
          title: this.title,
          content: this.content,
          deleted: !this.isUsing,
        };
        await patchPostByApi(this.auth.accessToken, post);
        this.history.goBack();
      } catch (e) {
        console.log('=== Error on modifying this post', e);
        alert('Post modify failed');
      }
    }
  };

  @action validationInput = () => {
    if (this.title === '' || this.content === '') {
      alert('Please enter the all of inputs');
      return false;
    }
    return true;
  };

  @action reset = () => {
    this.id = '';
    this.title = '';
    this.content = '';
    this.history = {};
  };
}

export default PostUpdateStore;
