import React from "react";
import { inject, observer } from "mobx-react";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { MdCreate } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

import PostDetailComponent from "../../components/PostDetailComponent";
import { GridCheckbox } from "../../components/GridCheckboxComponent";
import { timeConverter } from "../../utils/string";
import "../../css/NoticePage.style.css";

@inject("noticeStore", "authStore")
@observer
class NoticePage extends React.Component {
	async componentWillMount() {
		await this.props.noticeStore.setInitialStore();
		await this.props.noticeStore.updateNotices();
	}

	componentWillUnmount() {
		this.props.noticeStore.reset();
	}

	handleExpandChange = (event) => {
		event.dataItem.expanded = !event.dataItem.expanded;
		this.forceUpdate();
	};

	render() {
		const { push } = this.props.history;
		const store = this.props.noticeStore;
		return (
			<div className="content notice-container">
				<div
					className="content-title title-row"
					style={{
						height: 48,
						marginBottom: 20,
						justifyContent: "space-between",
					}}
				>
					{/* <span>Notice</span> */}
					<span>공지사항</span>
					<div className="title-util-tab" style={{ display: "flex", flexDirection: "row" }}>
						<button style={{ marginLeft: 15 }} disabled={!store.selectedId} className="secondary-button grid-button" onClick={() => push(`/notice/update/${store.selectedId}`)}>
							<MdCreate size={15} style={{ marginRight: 10 }} />
							{/* {"Modify"} */}
							{"수정"}
						</button>
						<button style={{ marginLeft: 15 }} className="primary-button grid-button" onClick={() => push(`/notice/write`)}>
							<FiPlus size={15} style={{ marginRight: 10 }} />
							{/* {"Create New"} */}
							{"새로 만들기"}
						</button>
					</div>
				</div>
				<Grid
					resizable
					data={orderBy(store.gridData, store.sort)}
					selectedField="selected"
					expandField="expanded"
					onRowClick={store.handleRowClick}
					onExpandChange={this.handleExpandChange}
					detail={(props) => <PostDetailComponent {...props} toggleDialog={store.toggleDialog} />}
				>
					<Column field="title" title="제목" width="512px" />
					<Column field="registerDate" title="작성일" width="512px" cell={(props) => <td>{timeConverter(props.dataItem.createdAt)}</td>} />
					<Column field="deleted" title="사용 여부" width="512px" cell={(props) => <td>{GridCheckbox(props)}</td>} />
				</Grid>
			</div>
		);
	}
}

export default NoticePage;
