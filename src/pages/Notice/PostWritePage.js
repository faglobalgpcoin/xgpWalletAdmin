import React from 'react';
import {Input} from '@progress/kendo-react-inputs';
import {Editor} from '@progress/kendo-editor-react-wrapper';
import {inject, observer} from 'mobx-react';
import {FiArrowLeft} from 'react-icons/fi';
import {IoMdCheckmark} from 'react-icons/io';
import '@progress/kendo-ui';

import '../../css/PostWritePage.style.css';

@inject('postWriteStore', 'authStore', 'history')
@observer
class PostWritePage extends React.Component {
    componentWillMount() {
        this.props.postWriteStore.setInitialStore(this.props.history);
    }

    componentWillUnmount() {
        this.props.postWriteStore.reset();
    }

    render() {
        const {goBack} = this.props.history;
        const store = this.props.postWriteStore;
        return (
            <div className="content post-form">
                <div className="content-title">
                    <button
                        className="back-button"
                        style={{marginBottom: -5}}
                        onClick={() => goBack()}>
                        <FiArrowLeft size={28} />
                    </button>
                    <span>
            {this.props.location.pathname === '/notice/write'
                ? 'New Post'
                : 'Modify Post'}
          </span>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}>
                        <button
                            style={{marginLeft: 15}}
                            className="primary-button grid-button"
                            onClick={() => store.handleSubmit()}>
                            <IoMdCheckmark size={23} style={{marginRight: 10}} />
                            {'Register'}
                        </button>
                    </div>
                </div>
                {/* <div className="header">
          <div className="content-title">새 공지사항 작성하기</div>
          <div className="header-button">
            <Button onClick={() => store.handleSubmit()} primary>
              <span className="k-icon k-i-check k-icon-20" />
              <span className="button-text">등록하기</span>
            </Button>
          </div>
        </div> */}
                <div className="form">
                    <div className="form-title">
                        <Input
                            name="title"
                            value={store.title}
                            placeholder="Please write the title"
                            onChange={store.handleChangeTitle}
                        />
                    </div>
                    <Editor value={store.content} change={store.handleChangeContent} />
                    <div className="form-box">
                        Using
                        <label className="k-form-field form-isUsing">
                            <input
                                type="checkbox"
                                id="isUsing"
                                className="k-checkbox"
                                checked={store.isUsing}
                                onChange={store.handleCheckboxChange}
                            />
                            <label className="k-checkbox-label" htmlFor="isUsing" />
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostWritePage;
