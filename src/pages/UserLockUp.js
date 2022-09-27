import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { GoSearch } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { MdCreate } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";

import { getCookie, decodeCookieData } from "../utils/auth";
import { getUsersByparams } from "../apis/admin";
import { getAppPropertyByKeyName } from "../apis/appProperty";
import LockUpModal from "../components/LockUpModal";
import { timeConverter } from "../utils/string";

function LockUp({ history }) {
	const [users, setUsers] = useState([]);
	const [sort, setSort] = useState([{ field: "", dir: "DESC" }]);

	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(20);
	const [total, setTotal] = useState(0);

	const [modalData, setModalData] = useState({});
	const [lockUpAll, setLockUpAll] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [catFilter, setCatFilter] = useState("all");

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

	async function fetchData(params) {
		const { accessToken } = decodeCookieData(getCookie("key"));
		const userResponse = await getUsersByparams(accessToken, { ...params });
		const propertyResponse = await getAppPropertyByKeyName(accessToken, "lock_up_all");

		if (!userResponse) return;
		if (!userResponse.status === "fail") return;

		if (userResponse.status === "success" && userResponse.data.total) {
			setUsers(userResponse.data.users);
			setTotal(userResponse.data.total);
			setSkip(userResponse.data.pageable.page * userResponse.data.pageable.size);
			setTake(userResponse.data.pageable.size);
		}

		if (!propertyResponse) return;
		if (propertyResponse.status === "fail") return;

		if (propertyResponse.status === "success" && propertyResponse.data.value) {
			setLockUpAll(propertyResponse.data.value === "true");
		}
	}

	useEffect(() => {
		fetchData({
			page: 1,
			size: 20,
			order: "",
			direction: "DESC",
			search: "",
		});
	}, []);

	const handleChangeFilterValue = (e) => {
		setFilterValue(e.target.value);
	};

	const handlePressKey = (e) => {
		if (e.key === "Enter") {
			handleClickSearch();
		}
	};

	const handlePressCategory = async (value) => {
		setCatFilter(value);
		const params = {
			page: 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
		};
		if (value !== "all") {
			params.isLockUp = value;
		}
		await fetchData(params);
	};

	const handleClickModalOpen = (data) => {
		setModalData(data);
		setIsModalOpen(true);
	};

	const pageChange = async (event) => {
		setSkip(event.page.skip);
		setTake(event.page.take);

		const params = {
			page: event.page.skip / event.page.take + 1,
			size: event.page.take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
		};
		if (catFilter !== "all") {
			params.isLockUp = catFilter;
		}
		await fetchData(params);
	};

	const handleClickSearch = async () => {
		const params = {
			page: 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
		};
		if (catFilter !== "all") {
			params.isLockUp = catFilter;
		}
		await fetchData(params);
	};

	const sortChange = async (sort) => {
		setSort(sort);
		const params = {
			page: skip / take + 1,
			size: take,
			order: sort[0] ? sort[0].field : "",
			direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
			search: filterValue,
		};
		if (catFilter !== "all") {
			params.isLockUp = catFilter;
		}
		await fetchData(params);
	};

	return (
		<div className="content user-container">
			<div className="content-title title-row" style={{ height: 48, marginBottom: 10, justifyContent: "flex-start" }}>
				{/* <span>Lock Up User</span> */}
				<span>유저별 락 설정</span>
				<hr />
				<div className="all-title" onClick={() => history.push("/lockup-all")}>
					{/* All User Lock Up */}
					전체 지갑 락 설정
					{lockUpAll ? (
						<span className="all-status on">
							<GoPrimitiveDot size={12} style={{ marginLeft: -3, marginRight: 2 }} /> ON
						</span>
					) : (
						<span className="all-status off">
							<GoPrimitiveDot size={12} style={{ marginLeft: -3, marginRight: 2 }} /> OFF
						</span>
					)}
				</div>
			</div>
			<div className="content-buttons">
				<div className="filter-wrapper">
					<div className={`filter-button ${catFilter === "all" && "active"}`} onClick={() => handlePressCategory("all")}>
						{/* All */}
						전체
					</div>
					<div className={`filter-button ${catFilter === "true" && "active"}`} onClick={() => handlePressCategory("true")}>
						{/* Lock Up */}
						잠금유저
					</div>
					<div className={`filter-button ${catFilter === "false" && "active"}`} onClick={() => handlePressCategory("false")}>
						{/* None */}
						해제유저
					</div>
				</div>
				<div className="search-area" style={{ display: "flex", flexDirection: "row", marginTop: -30 }}>
					{/* <button
                        className="secondary-button grid-button"
                        // onClick={() => history.push('/new-property')}
                    >
                        <MdLockOpen size={18} style={{ marginRight: 10 }} />
                        {'All User Unlock'}
                    </button> */}
					{/* <button
                        className="primary-button grid-button"
                        // onClick={() => history.push('/new-property')}
                    >
                        <MdLockOutline size={18} style={{ marginRight: 10 }} />
                        {'Lock'}
                    </button> */}

					<input
						type="text"
						className="search-form"
						// placeholder="Search for E-mail / Name / Mobile / Address"
						placeholder="E-mail / 이름 / 전화번호 / 지갑주소"
						value={filterValue}
						onChange={handleChangeFilterValue}
						onKeyPress={handlePressKey}
					/>
					<button type="button" className="search-button" style={{ top: 58 }} onClick={handleClickSearch}>
						<GoSearch size={18} style={{ marginRight: 10 }} />
					</button>
				</div>
			</div>

			<Grid
				style={{ height: "85%", width: "100%" }}
				data={users}
				onSortChange={(e) => sortChange(e.sort)}
				// onSortChange={(e) => console.log(e)}
				sort={sort}
				resizable
				total={total}
				pageable
				skip={skip}
				take={take}
				onPageChange={pageChange}
				sortable
			>
				{/* <Column
                    field="lockUp"
                    title="Lock Up"
                    width="100px"
                    locked
                    cell={(props) => (
                        <td colSpan="1" className="k-grid-content-sticky locked-left">
                            {props.dataItem.lockUp && (
                                <MdLockOutline
                                    size={20}
                                    style={{ marginBottom: '-3px', marginRight: '5px' }}
                                />
                            )}
                        </td>
                    )}
                /> */}
				<Column field="emailAddress" title="E-mail" width="220px" />
				<Column field="userId" title="ID" width="180px" />
				<Column field="name" title="Name" width="220px" />
				<Column field="phoneNumber" title="Mobile" width="150px" />
				<Column
					field="address"
					title="Address"
					width="415px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/accounts/${props.dataItem.address}`}>
								{props.dataItem.address}
							</a>
						</td>
					)}
				/>
				<Column
					field="ethAddress"
					title="ETHAddress"
					width="415px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://etherscan.io/address/${props.dataItem.ethAddress}`}>
								{props.dataItem.ethAddress}
							</a>
						</td>
					)}
				/>
				<Column
					field="btcAddress"
					title="BTCAddress"
					width="415px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://www.blockchain.com/btc/address/${props.dataItem.btcAddress}`}>
								{props.dataItem.btcAddress}
							</a>
						</td>
					)}
				/>
				<Column
					field="lockUp"
					title="Lock Up"
					width="100px"
					cell={(props) => <td colSpan="1">{props.dataItem.lockUp && <MdLockOutline size={20} style={{ marginBottom: "-3px", marginRight: "5px" }} />}</td>}
				/>
				<Column field="lockUpRate" title="Lock Up Rate" width="150px" />
				<Column
					field="lockUpPeriod"
					title="Lock Up Period"
					width="180px"
					cell={(props) => (
						<td>
							<span>{props.dataItem.lockUpPeriod && timeConverter(props.dataItem.lockUpPeriod)}</span>
						</td>
					)}
				/>
				<Column
					title=""
					width="120px"
					// locked
					cell={(props) => (
						<td className="k-grid-content-sticky locked-right">
							<button onClick={() => handleClickModalOpen(props.dataItem)} className="simple-circle-button" style={{ marginLeft: 10 }}>
								<MdCreate size={20} />
							</button>
						</td>
					)}
				/>
			</Grid>
			{isModalOpen && (
				<LockUpModal
					message={`Are you sure you want to delete`}
					data={modalData}
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
					fetchFunction={() =>
						fetchData({
							page: skip / take + 1,
							size: take,
							order: sort[0] ? sort[0].field : "",
							direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
							search: filterValue,
						})
					}
					// confirmFunction={handleDeleteDiamond}
				/>
			)}
		</div>
	);
}

export default LockUp;
