import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { GoSearch } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import * as moment from "moment";
import ReactExport from "react-export-excel";

import { getCookie, decodeCookieData } from "../utils/auth";
import APP_PROPERTY from "../constants/appProperty";
import { getAllTransactions, getTransactionsByparams } from "../apis/admin";
import { timeConverter } from "../utils/string";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function TransferList() {
	const [totalTransaction, setTotalTransaction] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [sort, setSort] = useState([{ field: "", dir: "DESC" }]);

	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(20);
	const [total, setTotal] = useState(0);
	const [startDate, setStartDate] = useState(false);
	const [endDate, setEndDate] = useState(false);

	const [filterValue, setFilterValue] = useState("");
	const [filter, setFilter] = useState({
		logic: "or",
		filters: [
			{ field: "txHash", operator: "contains", value: "" },
			{ field: "from", operator: "contains", value: "" },
			{ field: "to", operator: "contains", value: "" },
			{ field: "symbol", operator: "contains", value: "" },
		],
	});

	const fetchData = async (params) => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getTransactionsByparams(cookieData.accessToken, {
			...params,
		});

		if (!response) {
			return;
		}

		if (response && response.data) {
			setTransactions(response.data.transactions);
			setTotal(response.data.total);
			setSkip(response.data.pageable.page * response.data.pageable.size);
			setTake(response.data.pageable.size);
		}
	};

	const fetchDataAll = async () => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getAllTransactions(cookieData.accessToken);

		if (!response) {
			return;
		}

		if (response && response.data) {
			setTotalTransaction(response.data.transactions);
		}
	};

	useEffect(() => {
		fetchData({
			page: 1,
			size: 20,
			order: "",
			direction: "DESC",
			search: "",
			startDate,
			endDate
		});
		fetchDataAll();
	}, []);

	const handleChangeFilterValue = (e) => {
		setFilterValue(e.target.value);
	};

	const handlePressKey = (e) => {
		if (e.key === "Enter") {
			handleClickSearch();
		}
	};

	const getCurrentTimeForFilename = () => {
		return moment().format("YYYY-MM-D--hh-mm-ss");
	};

	const pageChange = async (event) => {
		setSkip(event.page.skip);
		setTake(event.page.take);
		await fetchData({
			page: event.page.skip / event.page.take + 1,
			size: event.page.take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
			startDate,
			endDate
		});
	};

	const handleClickSearch = async () => {
		await fetchData({
			page: 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
			startDate,
			endDate
		});
	};

	const sortChange = (sort) => {
		setSort(sort);
		fetchData({
			page: skip / take + 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
			startDate,
			endDate
		});
	};

	return (
		<div className="content">
			<div className="content-title title-row">
				<span>전송내역</span>
				<div className="title-util-tab" style={{ display: "flex", flexDirection: "row" }}>
					<div className="period-area">
						<label htmlFor="">
							<p className="label-title">시작일자</p>
							<input type="date" id="startDate" onChange={(e) => {setStartDate(e.target.value)}} />
						</label>
						<p className="line">-</p>
						<label htmlFor="">
							<p className="label-title">종료일자</p>
							<input type="date" id="endDate" onChange={(e) => {setEndDate(e.target.value)}} />
						</label>
					</div>
					<button type="button" onClick={handleClickSearch}>
						<GoSearch size={18} style={{ marginRight: 10 }} />
					</button>
					<ExcelFile
						filename={`${APP_PROPERTY.MAIN_TOKEN_SYMBOL}-Wallet-User-${getCurrentTimeForFilename()}`}
						element={
							<button style={{ marginLeft: 15 }} className="secondary-button grid-button">
								<FiUpload size={15} style={{ marginRight: 10 }} />
								{/* {"Export to Excel"} */}
								{"Excel로 다운로드"}
							</button>
						}
					>
						{
							<ExcelSheet data={totalTransaction} name="All">
								<ExcelColumn label="심볼" value="symbol" />
								<ExcelColumn label="TxHash" value="txHash" />
								<ExcelColumn label="보낸주소" value="from" />
								<ExcelColumn label="받는주소" value="to" />
								<ExcelColumn label="수량" value="volume" />
								<ExcelColumn label="상태" value="status" />
								<ExcelColumn label="전송시간" value="createdAt" />
							</ExcelSheet>
						}
					</ExcelFile>
					<div className="search-area">
						<input type="text" className="search-form" placeholder="txHash / From / To / Symbol" value={filterValue} onChange={handleChangeFilterValue} onKeyPress={handlePressKey} />
						{/* <button type="button" className="search-button" style={{ top: 14, right: 50 }} onClick={handleClickSearch}> */}
						<button type="button" className="search-button" style={{ top: 14, right: 50 }}>
							<GoSearch size={18} style={{ marginRight: 10 }} />
						</button>
					</div>
				</div>
			</div>
			<Grid
				style={{ height: "90%", width: "100%" }}
				data={transactions}
				onSortChange={(e) => sortChange(e.sort)}
				sort={sort}
				resizable
				total={total}
				pageable
				skip={skip}
				take={take}
				onPageChange={pageChange}
				sortable
			>
				<Column field="symbol" title="심볼" width="80px" />
				<Column
					field="txHash"
					title="txHash"
					width="570px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/transactions/${props.dataItem.txHash}`}>
								{props.dataItem.txHash}
							</a>
						</td>
					)}
				/>
				<Column
					field="from"
					title="보낸주소"
					width="380px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/accounts/${props.dataItem.from}`}>
								{props.dataItem.fromUserId === "" ? props.dataItem.from : props.dataItem.fromUserId}
							</a>
						</td>
					)}
				/>
				{/* 외부주소로 보내면 '외부주소'로 표기 */}
				<Column
					field="to"
					title="받는주소"
					width="380px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/accounts/${props.dataItem.to}`}>
								{props.dataItem.toUserId === "" ? props.dataItem.to : props.dataItem.toUserId}
							</a>
						</td>
					)}
				/>
				<Column field="volume" title="수량" width="170px" />
				<Column field="status" title="상태" width="100px" />
				<Column field="whereSend" title="전송위치" width="100px" />
				<Column field="createdAt" title="전송시간" width="170px" cell={(props) => <td colSpan="1">{timeConverter(props.dataItem.createdAt)}</td>} />
			</Grid>
		</div>
	);
}

export default TransferList;
