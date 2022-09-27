import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { GoSearch } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import * as moment from "moment";
import ReactExport from "react-export-excel";

import { getCookie, decodeCookieData, resetCookie } from "../utils/auth";
import APP_PROPERTY from "../constants/appProperty";
import { getAllUser, getUsersByparams, modifyUser } from "../apis/admin";
import { timeConverter } from "../utils/string";
import { checkUserRole } from "../apis/auth";
import { Link } from "react-router-dom";
import {create} from "mobx-persist";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Users() {
	const [popup, popupSet] = useState("");
	const [totalUser, setTotalUser] = useState([]);
	const [users, setUsers] = useState([]);
	const [sort, setSort] = useState([{ field: "", dir: "DESC" }]);

	const [userId, setUserId] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [pinCode, setPinCode] = useState("");
	const [password, setPassword] = useState("");
	const [userPic, setUserPic] = useState("");

	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(20);
	const [total, setTotal] = useState(0);

	const [filterValue, setFilterValue] = useState("");
	const [filter, setFilter] = useState({
		logic: "or",
		filters: [
			{ field: "emailAddress", operator: "contains", value: "" },
			{ field: "name", operator: "contains", value: "" },
			{ field: "phoneNumber", operator: "contains", value: "" },
			{ field: "address", operator: "contains", value: "" },
			{ field: "ethAddress", operator: "contains", value: "" },
			{ field: "btcAddress", operator: "contains", value: "" },
		],
	});

	const fetchData = async (params) => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getUsersByparams(cookieData.accessToken, {
			...params,
		});

		if (!response) {
			return;
		}

		if (response && response.data) {
			setUsers(response.data.users);
			setTotal(response.data.total);
			setSkip(response.data.pageable.page * response.data.pageable.size);
			setTake(response.data.pageable.size);
		}
	};

	const fetchDataAll = async () => {
		const cookieData = decodeCookieData(getCookie("key"));
		const response = await getAllUser(cookieData.accessToken);

		if (!response) {
			return;
		}

		if (response && response.data) {
			setTotalUser(response.data.users);
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

	const handleOnClick = (e) => {
		popupSet("active");
		setUserId(e.dataItem.userId);
		setId(e.dataItem.id);
		setName(e.dataItem.name);
		setPhoneNumber(e.dataItem.phoneNumber);
		setEmailAddress(e.dataItem.emailAddress);
		setUserPic(e.dataItem.userPic);
	};

	const handleOnChange = (e) => {
		switch (e.target.name) {
			case "emailAddress":
				setEmailAddress(e.target.value);
				break;
			case "password":
				setPassword(e.target.value);
				break;
			case "pinCode":
				setPinCode(e.target.value);
				break;
			case "name":
				setName(e.target.value);
				break;
			case "userId":
				setUserId(e.target.value);
				break;
			case "phoneNumber":
				setPhoneNumber(e.target.value);
				break;
			default:
				break;
		}
	};

	const onSubmit = async () => {
		let result;
		const cookieData = decodeCookieData(getCookie("key"));
		const userResponse = await checkUserRole(cookieData.accessToken);

		if (!userResponse.data.active) {
			resetCookie();
			history.push("/");
		}

		result = await modifyUser(cookieData.accessToken, {
			id,
			emailAddress,
			userId,
			password,
			pinCode,
			name,
			phoneNumber,
		});

		if (result && result.status === "success") {
			fetchData({
				page: 1,
				size: 20,
				order: "",
				direction: "DESC",
				search: "",
			});
			fetchDataAll();
			popupSet("");
		}
	};

	return (
		<div className="content">
			<div className="content-title title-row">
				<span>유저</span>
				<div className="title-util-tab" style={{ display: "flex", flexDirection: "row" }}>
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
						<ExcelSheet data={totalUser} name="All">
							<ExcelColumn label="E-mail" value="emailAddress" />
							<ExcelColumn label="ID" value="userId" />
							<ExcelColumn label="Name" value="name" />
							<ExcelColumn label="Mobile" value="phoneNumber" />
							<ExcelColumn label="Address" value="address" />
							<ExcelColumn label="ETHAddress" value="ethAddress" />
							<ExcelColumn label="BTCAddress" value="btcAddress" />
              <ExcelColumn label="CreatedAt" value={(col) => moment(new Date(col.createdAt)).format("YYYY-MM-DD hh:mm:ss")} />
						</ExcelSheet>
					</ExcelFile>
					<div className="search-area">
						<input
							type="text"
							className="search-form"
							// placeholder="Search for E-mail / Name / Mobile / Address"
							placeholder="E-mail / 이름 / 전화번호 / 지갑주소"
							value={filterValue}
							onChange={handleChangeFilterValue}
							onKeyPress={handlePressKey}
						/>
						<button type="button" className="search-button" style={{ top: 14, right: 5 }} onClick={handleClickSearch}>
							<GoSearch size={18} style={{ marginRight: 10 }} />
						</button>
					</div>
				</div>
			</div>

			<Grid
				style={{ height: "90%", width: "100%" }}
				data={users}
				onSortChange={(e) => sortChange(e.sort)}
				sort={sort}
				resizable
				total={total}
				pageable
				skip={skip}
				take={take}
				onPageChange={pageChange}
				sortable
				onRowClick={handleOnClick}
			>
				<Column field="emailAddress" title="E-mail" width="250px" />
				<Column field="userId" title="ID" width="180px" />
				<Column field="name" title="Name" width="180px" />
				<Column field="phoneNumber" title="Mobile" width="180px" />
				<Column
					field="address"
					title="Address"
					width="370px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/accounts/${props.dataItem.address}`}>
								{props.dataItem.address}
							</a>
						</td>
					)}
					width="370px"
				/>
				<Column
					field="ethAddress"
					title="ETHAddress"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://etherscan.io/address/${props.dataItem.ethAddress}`}>
								{props.dataItem.ethAddress}
							</a>
						</td>
					)}
					width="370px"
				/>
				<Column
					field="btcAddress"
					title="BTCAddress"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://www.blockchain.com/btc/address/${props.dataItem.btcAddress}`}>
								{props.dataItem.btcAddress}
							</a>
						</td>
					)}
					width="350px"
				/>
				<Column field="createdAt" title="Sign Up Date" cell={(props) => <td colSpan="1">{timeConverter(props.dataItem.createdAt)}</td>} width="200px" />
			</Grid>
			{/* 유저 name or mobile 클릭시 modal addClass(active) */}
			<div className={`user-modal ${popup}`}>
				<div className="user-modal-content">
					<div className="user-modal-content-title">회원상세정보</div>
					<div className="user-modal-content-items">
						<div className="user-modal-content-items-item">
							<label>
								<p>이메일</p>
								<input type="text" name="emailAddress" value={emailAddress} onChange={handleOnChange} />
							</label>
							<label>
								<p>비밀번호</p>
								<input type="password" name="password" value={password} onChange={handleOnChange} />
							</label>
							<label>
								<p>PIN 비밀번호</p>
								<input type="password" name="pinCode" maxLength={4} value={pinCode} onChange={handleOnChange} />
							</label>
							<label>
								<p>이름</p>
								<input type="text" name="name" value={name} onChange={handleOnChange} />
							</label>
							<label>
								<p>ID</p>
								<input type="text" name="userId" value={userId} onChange={handleOnChange} />
							</label>
							<label>
								<p>전화번호</p>
								<input type="text" name="phoneNumber" value={phoneNumber} onChange={handleOnChange} />
							</label>
							<label>
								<p>ID Card</p>
								<div className="userpic-wrap">
									<img src={userPic} />
								</div>
							</label>
						</div>
						<div className="content-modal-items-button">
							<div className="content-modal-items-button-item">
								<button
									className="modal-cancel"
									onClick={() => {
										popupSet("");
										setUserId("");
										setId("");
										setName("");
										setPhoneNumber("");
										setEmailAddress("");
										setPassword("");
										setPinCode("");
									}}
								>
									리스트
								</button>
								<button className="modal-submit" onClick={onSubmit}>
									수정
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Users;
