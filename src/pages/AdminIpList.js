import React, { useEffect, useState } from "react";
import { decodeCookieData, getCookie, resetCookie } from "../utils/auth";
import { checkUserRole } from "../apis/auth";
import { deleteAdminIp, getAdminAllowIps, registerAdminIp } from "../apis/admin";

function AdminIpList(props) {
	const [popup, popupSet] = useState("");
	const [ips, setIps] = useState([]);
	const [myIp, setMyIp] = useState("");
	const [id, setId] = useState("");
	const [ip1, setIp1] = useState("");
	const [ip2, setIp2] = useState("");
	const [ip3, setIp3] = useState("");
	const [ip4, setIp4] = useState("");

	function viewPopup() {
		popupSet("active");
	}
	function closePopup() {
		popupSet("");
	}

	const fetchData = async () => {
		const cookieData = decodeCookieData(getCookie("key"));
		const userResponse = await checkUserRole(cookieData.accessToken);

		if (!userResponse.data.active) {
			resetCookie();
			history.push("/");
		}

		if (userResponse.data.level !== 10) {
			alert("Please check your account again");
			history.push("/");
			return;
		}

		const response = await getAdminAllowIps(cookieData.accessToken);

		if (!response) {
			return;
		}

		if (response && response.data) {
			setIps(response.data.adminAllowIps);
			setMyIp(response.data.myIp);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const listHtml = (props) => {
		return (
			<tr key={props.id}>
				<td>
					<input type="checkbox" name="id" value={props.id} onChange={handleOnChange} />
				</td>
				<td>
					{props.ip} {props.ip === myIp ? <span>(내 아이피)</span> : null}
				</td>
				<td className="edit-button">
					<button
						onClick={() => {
							onDeleteSubmit(props.id);
						}}
					>
						삭제
					</button>
				</td>
			</tr>
		);
	};

	const handleOnChange = (e) => {
		switch (e.target.name) {
			case "id":
				if (e.target.checked) setId(e.target.value);
				else setId("");
				break;
			case "ip1":
				setIp1(e.target.value);
				break;
			case "ip2":
				setIp2(e.target.value);
				break;
			case "ip3":
				setIp3(e.target.value);
				break;
			case "ip4":
				setIp4(e.target.value);
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

		if (userResponse.data.level !== 10) {
			alert("Please check your account again");
			history.push("/users");
			return;
		}

		result = await registerAdminIp(cookieData.accessToken, {
			ip: ip1 + "." + ip2 + "." + ip3 + "." + ip4,
		});

		if (result && result.status === "success") {
			fetchData();
			closePopup();
		} else {
			alert("아이피 추가에 실패했습니다.");
		}
	};

	const onDeleteSubmit = async (id) => {
		let result;

		const cookieData = decodeCookieData(getCookie("key"));
		const userResponse = await checkUserRole(cookieData.accessToken);

		if (!userResponse.data.active) {
			resetCookie();
			history.push("/");
		}

		if (userResponse.data.level !== 10) {
			alert("Please check your account again");
			history.push("/users");
			return;
		}

		if (id === "") {
			alert("삭제할 아이피를 선택해주세요.");
			return;
		}

		result = await deleteAdminIp(cookieData.accessToken, {
			id,
		});

		if (result && result.status === "success") {
			fetchData();
		} else {
			alert("아이피 삭제에 실패했습니다.");
		}
	};

	return (
		<div className="content">
			<div className="content-title title-row">
				<span>관리자 IP 설정</span>
				<div className="button-list title-util-tab">
					<button className="addAdmin" onClick={viewPopup}>
						관리자 IP 추가
					</button>
					{/*위 버튼 클릭시 content-modal에 class추가(className = active) */}
					<button
						className="delAdmin"
						onClick={() => {
							onDeleteSubmit(id);
							console.log(id);
						}}
					>
						선택 삭제
					</button>
				</div>
			</div>
			<div className="content-items">
				<div className="content-items-table">
					<table>
						<thead>
							<tr>
								<th>
									<input type="checkbox" />
								</th>
								<th>IP</th>
								<th>관리</th>
							</tr>
						</thead>
						<tbody>
							{ips.map((v) => {
								return listHtml(v);
							})}
						</tbody>
					</table>
				</div>
			</div>
			<div className={`content-modal ${popup}`}>
				<div className="content-modal-items">
					<div className="content-modal-items-table">
						<table>
							<thead>
								<tr>
									<th>IP</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="input-ip">
										<input type="text" placeholder="" maxLength={3} value={ip1} name="ip1" onChange={handleOnChange} />
										<span>.</span>
										<input type="text" placeholder="" maxLength={3} value={ip2} name="ip2" onChange={handleOnChange} />
										<span>.</span>
										<input type="text" placeholder="" maxLength={3} value={ip3} name="ip3" onChange={handleOnChange} />
										<span>.</span>
										<input type="text" placeholder="" maxLength={3} value={ip4} name="ip4" onChange={handleOnChange} />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="content-modal-items-button">
						<div className="content-modal-items-button-item">
							<button className="modal-cancel" onClick={closePopup}>
								리스트
							</button>
							<button className="modal-submit" onClick={onSubmit}>
								추가
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminIpList;
