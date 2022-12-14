import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { CSVLink } from "react-csv";
import { AiOutlineDownload } from "react-icons/ai";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineLink } from "react-icons/ai";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { inject, observer } from "mobx-react";
import BigNumber from "bignumber.js";
import Papa from "papaparse";

import { decodeCookieData, getCookie } from "../utils/auth";
import { getAppPropertyByKeyName } from "../apis/appProperty";
import { getBalanceByAddress, getTokenInfos } from "../apis/user";
import { NumberWithCommas } from "../utils/string";
import APP_PROPERTY from "../constants/appProperty";
import {airdropToAdmin, airdropToAdminWithId} from "../apis/admin";

const csvExampleData = [["To", "Amount"]];

function AirdropTransferForAdmin({ history, snackbarStore, match }) {
	const [accessToken, setAccessToken] = useState("");
	const [address, setAddress] = useState("");
	const [balance, setBalance] = useState("");
	const [dataFile, setDataFile] = useState("");
	const [airdropData, setAirdropData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

	const { activeSnackbar } = snackbarStore;

	useEffect(() => {
		async function fetchData() {
			const { accessToken } = decodeCookieData(getCookie("key"));
			setAccessToken(accessToken);

			const response = await getAppPropertyByKeyName(accessToken, "admin_address");

			if (!response) return;
			if (!response.status === "fail") return;

			if (response.status === "success") {
				setAddress(response.data.value);
				fetchBalance(response.data.value, match.params.tokenSymbol);
			}
		}

		fetchData();
	}, [match]);

	const handleChangeFile = (e) => {
		let gridData = [];
		const currentFile = e.target.files[0];

		if (!currentFile) {
			return;
		}

		setDataFile(currentFile);

		Papa.parse(currentFile, {
			before: function(file, inputElem) {
				console.log("Parsing file...", file);
			},
			error: function(err, file) {
				console.log("ERROR:", err, file);
			},
			complete: async function(results) {
				console.log("Parse complete");
				console.log(results.data);

				if (results.data.length > 0) {
					for (let i = 1; i < results.data.length; i++) {
						await gridData.push({
							id: i,
							to: results.data[i][0],
							amount: results.data[i][1],
						});
					}
				}

				setAirdropData(gridData);
			},
		});
	};

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
					setBalance(balanceStr);
				} else {
					setBalance("0");
				}
			} else {
				setDecimals("18");
			}
		}
	};

	const handleClickCopy = () => {
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 2500);

		var tempElem = document.createElement("textarea");
		tempElem.value = address;
		document.body.appendChild(tempElem);

		tempElem.select();
		document.execCommand("copy");
		document.body.removeChild(tempElem);
	};

	const resetState = () => {
		setAirdropData([]);
		setDataFile([]);
		setAmount('');
		setUserId('');
	};

	const handleClickTransfer = async () => {
		setIsLoading(true);
		for (let i = 0; i < airdropData.length; i++) {
			const response = await airdropToAdmin(accessToken, {
				receiveAddress: airdropData[i].to,
				amount: airdropData[i].amount,
				sideTokenSymbol: APP_PROPERTY.TOKEN_SYMBOL[match.params.tokenSymbol],
				type: "luniverse",
			});
			console.log(response);
		}
		activeSnackbar("Transfer successful!");
		setIsLoading(false);
		resetState();
	};

  const handleTransfer = async () => {
    const response = await airdropToAdminWithId(accessToken, {
      userId: userId,
      amount: amount,
      sideTokenSymbol: APP_PROPERTY.TOKEN_SYMBOL[match.params.tokenSymbol],
      type: "luniverse",
    });

    if (!response) {
      activeSnackbar("Transfer Fail!");
      return false;
    }

    if (response.status === "fail") {
      activeSnackbar("Transfer Fail!");
      return false;
    }

    activeSnackbar("Transfer successful!");
    setIsLoading(false);
    resetState();
  }

	return (
		<div className={`${airdropData && airdropData.length > 0 ? "scroll-" : ""}content padding-container`}>
			<div className="content-title title-row">
				<span>Transfer to Admin {APP_PROPERTY.TOKEN_SYMBOL[match.params.tokenSymbol]}</span>
			</div>
			<div className="half-block airdrop-container" style={{ minHeight: 300, paddingTop: 35 }}>
				<form className="form">
					<div className="row">
						<div className="caution-wrapper">
							<div>
								<span>???</span>
								{/* <span>Download the sample file and enter the information according to the format. (CSV file format)</span> */}
								<span>?????? ????????? ?????????????????? ????????? ?????? ????????? ??????????????????. (CSV ?????? ??????)</span>
							</div>
							<div>
								<span>???</span>
								{/* <span>Upload the file and verify that the information was successfully entered.</span> */}
								<span>????????? ??????????????? ????????? ??????????????? ?????????????????? ??????????????????.</span>
							</div>
							<div>
								<span>???</span>
								{/* <span>After verifying all the information, click [Transfer] to complete the transfer.</span> */}
								<span>?????? ????????? ????????? ??? [??????]??? ???????????? ????????? ???????????????.</span>
							</div>
							<div>
								<span>???</span>
								{/* <span style={{ color: "#8E54E9" }}>A transfer cannot be undone! Be sure to click that the information you entered is correct!</span> */}
								<span style={{ color: "#8E54E9" }}>????????? ?????? ??? ??? ????????????! ?????? ??? ????????? ???????????? ??????????????????!</span>
							</div>
						</div>
					</div>
					<div className="row" style={{ height: 50 }}>
						{/* <div className="title">Admin Address</div> */}
						<div className="title">????????? ??????</div>
						<div>
							<span>{address}</span>
							<span className="link-button" onClick={handleClickCopy}>
								<AiOutlineLink size={17} style={{ marginLeft: 5, marginBottom: -2 }} />
							</span>
						</div>
					</div>
					<div className="row" style={{ height: 50, marginBottom: 0 }}>
						{/* <div className="title">Balance</div> */}
						<div className="title">??????</div>
						<div>
							<span className="balance">{`${balance} ${APP_PROPERTY.TOKEN_SYMBOL[match.params.tokenSymbol]}`}</span>
						</div>
					</div>
					<hr />
					<div className="row" style={{ height: 50, marginBottom: 25 }}>
						{/* <div className="title">Airdrop Information</div> */}
						<div className="title">?????? ?????? ??????</div>
						<CSVLink data={csvExampleData} filename={"airdrop-sample.csv"} target="_blank">
							<div className="text-button">
								<AiOutlineDownload size={17} style={{ marginRight: 10 }} />
								{/* Download Sample File */}
								???????????? ????????????
							</div>
						</CSVLink>
					</div>
					<div className="row">
						<div className="upload-wrapper">
							<label htmlFor="ex_file">
								<AiOutlineUpload size={17} style={{ marginRight: 10 }} />
								{dataFile && dataFile.name ? "Re-Upload" : "Upload"} CSV File
							</label>
							<input className="input-tag" type="file" name="file" id="ex_file" onChange={handleChangeFile} />
						</div>
					</div>
					{airdropData && airdropData.length > 0 && (
						<div className="row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
							<div className="title" style={{ marginBottom: 35, marginTop: 15 }}>
								{/* Airdrop List View */}
								???????????? ??????
								<span style={{ marginLeft: 5 }}>({dataFile.name})</span>
							</div>
							<Grid style={{ height: "500px", width: "100%" }} data={airdropData} resizable>
								<Column field="id" title="#" width="80px" />
								<Column field="to" title="Receiver Address" />
								<Column field="amount" title="Amount" />
							</Grid>
						</div>
					)}
					<div className="row" style={{ justifyContent: "flex-end", marginTop: 15 }}>
						<button type="button" className="primary-button" style={{ width: 250 }} onClick={handleClickTransfer} disabled={!(airdropData && airdropData.length > 0) || balance === 0}>
							{isLoading && (
								<span style={{ marginBottom: -3, marginRight: 7 }}>
									<ClipLoader size={18} color={"white"} loading={isLoading} style={{ marginRight: 5 }} />
								</span>
							)}
							{/* Transfer */}
							??????
						</button>
					</div>
					<div className="row">
						<h5>????????? ???????????? ??????</h5>
					</div>
					<div className="row transfer-individual">
						<div className="transfer-individual-input">
							<label htmlFor="">
								<p>???????????????</p>
                <input type="text" required value={userId} onChange={(props) => {
                  setUserId(props.target.value);
                }} />
							</label>
						</div>
						<div className="transfer-individual-input">
							<label htmlFor="">
								<p>??????(XGP)</p>
                <input type="text" required value={amount} onChange={(props) => {
                  setAmount(props.target.value);
                }} />
							</label>
						</div>
            <button type="button" className="primary-button" onClick={handleTransfer} >
							??????
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default inject("snackbarStore")(observer(AirdropTransferForAdmin));
