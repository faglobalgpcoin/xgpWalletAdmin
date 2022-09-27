import React, { useState, useEffect } from "react";
import Switch from "react-switch";

import { getAppPropertyByKeyName } from "../apis/appProperty";
import { decodeCookieData, getCookie } from "../utils/auth";
import {updateAppProperty} from "../apis/admin";

function LockUpAll() {
	const [checked, setChecked] = useState(false);
	const [accessToken, setAccessToken] = useState("");

	const fetchData = async (accessToken) => {
		const response = await getAppPropertyByKeyName(accessToken, "lock_up_all");

		if (!response) {
			return;
		}

		if (response.status === "fail") return;

		if (response.status === "success" && response.data) {
			setChecked(response.data.value === "true");
		}
	};

	useEffect(() => {
		const { accessToken } = decodeCookieData(getCookie("key"));
		setAccessToken(accessToken);
		fetchData(accessToken);
	}, []);

	const handleChange = async (checked) => {
		const response = await updateAppProperty(accessToken, {
			keyName: "lock_up_all",
			value: checked.toString(),
		});

		if (!response) return;
		if (response.status === "fail") {
      alert("변경에 실패했습니다");
		  return;
    }

		if (response.status === "success") {
			setChecked(response.data.value === "true");
		} else {
		  alert("변경에 실패했습니다");
    }
	};

	return (
		<div className="content">
			<div className="content-title title-row" style={{ height: 48, marginBottom: 10 }}>
				{/* <span>Lock Up All</span> */}
				<span>전체지갑 락 설정</span>
			</div>
			<div className="half-block switch-container">
				{/* <span style={{ color: "#424242", fontWeight: "600" }}>Set Lock Up for All User</span> */}
				<span style={{ color: "#424242", fontWeight: "600" }}>전체 사용자 지감 잠금</span>
				<div>
					<Switch
						height={33}
						width={80}
						onChange={handleChange}
						checked={checked}
						onColor={"#02AAB0"}
						uncheckedIcon={
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
									fontWeight: "bold",
									fontSize: 15,
									color: "white",
									paddingRight: 2,
								}}
							>
								OFF
							</div>
						}
						checkedIcon={
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
									fontWeight: "bold",
									fontSize: 15,
									color: "white",
									paddingRight: 2,
								}}
							>
								ON
							</div>
						}
					/>
				</div>
			</div>
		</div>
	);
}

export default LockUpAll;
