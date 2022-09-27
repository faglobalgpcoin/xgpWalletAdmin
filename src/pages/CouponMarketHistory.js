import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { GoSearch } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import * as moment from "moment";
import ReactExport from "react-export-excel";

import { getCookie, decodeCookieData } from "../utils/auth";
import APP_PROPERTY from "../constants/appProperty";
import { getAllCouponPurchaseHistory, getCouponPurchaseHistory } from "../apis/admin";
import { timeConverter } from "../utils/string";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function CouponMarketHistory() {
	const [totalPurchases, setTotalPurchases] = useState([]);
	const [purchases, setPurchases] = useState([]);
	const [sort, setSort] = useState([{ field: "", dir: "DESC" }]);

	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(20);
	const [total, setTotal] = useState(0);

	const [filterValue, setFilterValue] = useState("");
	const [filter, setFilter] = useState({
		logic: "or",
		filters: [
			{ field: "userId", operator: "contains", value: "" },
			{ field: "txId", operator: "contains", value: "" },
		],
	});

	const fetchData = async (params) => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getCouponPurchaseHistory(cookieData.accessToken, {
			...params,
		});

		if (!response) {
			return;
		}

		if (response && response.data) {
			setPurchases(response.data.purchases);
			setTotal(response.data.total);
			setSkip(response.data.pageable.page * response.data.pageable.size);
			setTake(response.data.pageable.size);
		}
	};

	const fetchDataAll = async () => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getAllCouponPurchaseHistory(cookieData.accessToken);

		if (!response) {
			return;
		}

		if (response && response.data) {
			setTotalPurchases(response.data.purchases);
		}
	};

	useEffect(() => {
		fetchData({
			page: 1,
			size: 20,
			order: "",
			direction: "DESC",
			search: "",
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
		});
	};

	const handleClickSearch = async () => {
		await fetchData({
			page: 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
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
		});
	};

	return (
		<div className="content">
			<div className="content-title title-row">
				<span>쿠폰마켓구매내역</span>
				<div className="title-util-tab" style={{ display: "flex", flexDirection: "row" }}>
					<ExcelFile
						filename={`${APP_PROPERTY.MAIN_TOKEN_SYMBOL}-Coupon-Market-History-${getCurrentTimeForFilename()}`}
						element={
							<button style={{ marginLeft: 15 }} className="secondary-button grid-button">
								<FiUpload size={15} style={{ marginRight: 10 }} />
								{/* {"Export to Excel"} */}
								{"Excel로 다운로드"}
							</button>
						}
					>
						{
							<ExcelSheet data={totalPurchases} name="All">
								<ExcelColumn label="ID" value="id" />
								<ExcelColumn label="회원아이디" value="userId" />
								<ExcelColumn label="휴대폰번호" value="phoneNumber" />
								<ExcelColumn label="가격" value="volume" />
								<ExcelColumn label="코인수량" value="convertVolume" />
								<ExcelColumn label="전송시간" value="createdAt" />
							</ExcelSheet>
						}
					</ExcelFile>
					<div className="search-area">
						<input type="text" className="search-form" placeholder="UserId / TxId" value={filterValue} onChange={handleChangeFilterValue} onKeyPress={handlePressKey} />
						{/* <button type="button" className="search-button" style={{ top: 14, right: 50 }} onClick={handleClickSearch}> */}
						<button type="button" className="search-button" style={{ top: 14, right: 50 }}>
							<GoSearch size={18} style={{ marginRight: 10 }} />
						</button>
					</div>
				</div>
			</div>
			<Grid
				style={{ height: "90%", width: "100%" }}
				data={purchases}
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
				<Column field="id" title="ID" width="400px" />
				<Column field="userId" title="회원아이디" width="300px" />
				<Column field="phoneNumber" title="휴대폰번호" width="300px" />
				<Column field="volume" title="가격" width="200px" />
				<Column field="convertVolume" title="코인수량" width="200px" />
				<Column field="createdAt" title="시간" width="390px" cell={(props) => <td colSpan="1">{timeConverter(props.dataItem.createdAt)}</td>} />
			</Grid>
		</div>
	);
}

export default CouponMarketHistory;
