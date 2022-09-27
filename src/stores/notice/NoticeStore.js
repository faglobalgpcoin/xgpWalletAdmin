import {action, computed, observable} from 'mobx';

import {getNoticeList} from '../../apis/notice';
import {getCookie, decodeCookieData} from '../../utils/auth';

class NoticeStore {
    auth = {};

    @observable isVisibleConfirmDialog = false;

    @observable selectedId = '';

    @observable noticeList = [];

    @observable sort = [
        {field: 'isUsing', dir: 'desc'},
        {field: 'registerDate', dir: 'desc'},
    ];

    @computed get gridData() {
        return this.noticeList.map((i) => ({
            ...i,
            selected: i.id === this.selectedId,
        }));
    }

    @action setInitialStore = () => {
        const {accessToken} = decodeCookieData(getCookie('key'));
        this.auth = {accessToken};
    };

    @action
    async updateNotices() {
        const response = await getNoticeList(this.auth.accessToken);
        this.noticeList = response.data.data;
    }

    @action handleRowClick = (event) => {
        if (this.selectedId === event.dataItem.id) {
            this.selectedId = '';
        } else {
            this.selectedId = event.dataItem.id;
        }
    };

    @action reset = () => {
        this.selectedId = '';
    };
}

export default NoticeStore;
