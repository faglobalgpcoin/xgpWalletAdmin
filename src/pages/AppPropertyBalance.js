import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { decodeCookieData, getCookie } from "../utils/auth";
import { getAppProperties } from "../apis/appProperty";
import { getBalanceByAddress, getTokenInfos } from "../apis/user";
import APP_PROPERTY from "../constants/appProperty";
import BigNumber from "bignumber.js";

const AppPropertyBalance = ({}) => {
	const [properties, setProperties] = useState([]);
	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	const addressList = (element) => {
		if (element.keyName.indexOf("address") > -1) {
			return true;
		}
	};

	useEffect(() => {
		async function fetchData() {
			const cookieData = decodeCookieData(getCookie("key"));
			const response = await getAppProperties(cookieData.accessToken);

			if (!response) {
				return;
			}

			if (response.data) {
				const data = response.data.filter(addressList);
				const balanceLists = data.map(async (item) => {
					let balance = await fetchBalance(item.value, "XGP");
					return { keyName: item.keyName, address: item.value, balance };
				});
				const lists = await Promise.all(balanceLists);
				setProperties(lists);
			}
		}

		fetchData();
	}, []);

	const fetchBalance = async (address, symbol) => {
		const { accessToken } = decodeCookieData(getCookie("key"));
		const tokenResponse = await getTokenInfos();

		if (tokenResponse && tokenResponse.status === "success") {
			const tokensInfo = tokenResponse.data;
			const tokenInfo = tokensInfo.find((i) => i.symbol === APP_PROPERTY.TOKEN_SYMBOL[symbol]);

			if (tokenInfo) {
				const { symbol, type, decimals } = tokenInfo;
				const tokenBalanceResponse = await getBalanceByAddress(accessToken, symbol, type, address);

				if (tokenBalanceResponse && tokenBalanceResponse.status === "success") {
					const { balance } = tokenBalanceResponse.data;
					const balanceBN = new BigNumber(balance);
					const balanceStr = balanceBN.shiftedBy(-decimals).toString();
					return balanceStr;
				} else {
					return "0";
				}
			}
		}
	};

	return (
		<div className="content">
			<div className="content-title title-row">
				{/* <span>Wallet Property</span> */}
				<span>관리지갑</span>
			</div>
			<Grid style={{ height: "90%", width: "100%" }} resizable data={properties}>
				<Column field="keyName" title="종류" width="330px" />
				<Column
					field="address"
					title="주소"
					width="620px"
					cell={(props) => (
						<td colSpan="1">
							<a target="_blank" href={`https://sidescan.luniverse.io/chains/7806468005210300226/accounts/${props.dataItem.address}`}>
								{props.dataItem.address}
							</a>
						</td>
					)}
				/>
				<Column field="balance" title="수량" width="620px" cell={(props) => <td colSpan="1">{props.dataItem.balance} XGP</td>} />
			</Grid>
		</div>
	);
};

export default AppPropertyBalance;
