import React from 'react';
import { GridDetailRow } from '@progress/kendo-react-grid';
import '../css/PostDetailPage.style.css';

class PostDetailComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return (
      <section className="detail">
        <div dangerouslySetInnerHTML={{ __html: dataItem.content }} />
      </section>
    );
  }
}

export default PostDetailComponent;
