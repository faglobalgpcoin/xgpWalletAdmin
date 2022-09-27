import {observable, action} from 'mobx';
import {postPostByApi} from '../../apis/notice';
import {decodeCookieData, getCookie} from '../../utils/auth';

class PostWriteStore {
    auth = {};

    @observable title = '';

    @observable content = 'Please write the content';

    @observable isUsing = true;

    @observable history = {};

    @action setInitialStore = (history) => {
        const {accessToken} = decodeCookieData(getCookie('key'));
        this.auth = {accessToken};
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
                    title: this.title,
                    content: this.content,
                    deleted: !this.isUsing,
                };
                await postPostByApi(this.auth.accessToken, post);
                this.history.goBack();
            } catch (e) {
                console.log('=== Error on post regsiter', e);
                alert('Post register failed');
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
        this.title = '';
        this.content = 'Please write the content';
        this.history = {};
    };
}

export default PostWriteStore;
