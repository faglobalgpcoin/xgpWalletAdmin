import React from 'react';
import {Input} from '@progress/kendo-react-inputs';
import {Editor} from '@progress/kendo-editor-react-wrapper';
import {inject, observer} from 'mobx-react';
import {FiArrowLeft} from 'react-icons/fi';
import {IoMdCheckmark} from 'react-icons/io';
import '@progress/kendo-ui';
import '../../css/PostWritePage.style.css';

@inject('postUpdateStore', 'history', 'noticeStore')
@observer
class PostUpdatePage extends React.Component {
  componentWillMount() {
    this.props.postUpdateStore.setInitialStore(
      this.props.match.params.postId,
      this.props.noticeStore,
      this.props.history,
    );
  }

  render() {
    const {goBack} = this.props.history;
    const store = this.props.postUpdateStore;
    return (
      <div className="content post-form">
        <div className="content-title">
          <button
            className="back-button"
            style={{marginBottom: -5}}
            onClick={() => goBack()}>
            <FiArrowLeft size={28} />
          </button>
          <span>Modify Post</span>
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
              {'Submit'}
            </button>
          </div>
        </div>
        <div className="form">
          <div className="form-title">
            <Input
              name="title"
              value={store.title}
              placeholder="제목을 입력해주세요"
              onChange={store.handleChangeTitle}
            />
          </div>
          <Editor value={store.content} change={store.handleChangeContent} />
        </div>
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
    );
  }
}

export default PostUpdatePage;
