import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { GiAirBalloon, GiTwoCoins } from "react-icons/gi";
import { MdLockOutline, MdSupervisorAccount } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaUserLock, FaExchangeAlt, FaUserCog } from "react-icons/fa";
import { GoBrowser, GoDeviceDesktop } from "react-icons/go";
import { TiClipboard } from "react-icons/ti";

import { resetCookie } from "../../utils/auth";
import { SCAN_URL } from "../../constants/api";

class Navigation extends React.Component {
	state = {
		isFold: true,
	};

	handleLogout = () => {
		resetCookie();
		this.props.history.push("/");
	};

	handleToggleFold = () => {
		this.setState((prevState) => ({ isFold: !prevState.isFold }));
	};

	render() {
		return (
			<div className="c-nav">
				<div className="title">
					<div style={{ cursor: "pointer" }} onClick={() => this.props.history.push("/")}>
						<img src={require("../../imgs/intro_moon.png")} alt="logo" height={50} />
					</div>
				</div>

				<ul>
					<li>
						<NavLink
							to="/wallet-properties"
							className="link"
							activeClassName="active"
							isActive={(_, { pathname }) => {
								return pathname.includes("/wallet-properties") || pathname.includes("/new-property") || pathname.includes("/modify-property");
							}}
						>
							<GiTwoCoins size={19} />
							{/* Wallet Property */}
							환경설정
						</NavLink>
					</li>
          <li>
            <NavLink
              to="/wallet-prop-amount"
              className="link"
              activeClassName="active"
            >
              <GiTwoCoins size={19} />
              {/* Wallet Property */}
              관리지갑
            </NavLink>
          </li>
					<hr />
					<li>
						<NavLink
							to="/users"
							className="link"
							activeClassName="active"
							// isActive={(_, { pathname }) =>
							//   ['/rough-diamond', '/new-rough-diamond'].includes(pathname)
							// }
						>
							<MdSupervisorAccount size={20} />
							{/* Users */}
							유저
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/transferlist"
							className="link"
							activeClassName="active"
							// isActive={(_, { pathname }) =>
							//   ['/rough-diamond', '/new-rough-diamond'].includes(pathname)
							// }
						>
							<FaExchangeAlt size={20} />
							전송내역
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/lockup-all"
							className="link"
							activeClassName="active"
							// isActive={(_, { pathname }) =>
							//   ['/rough-diamond', '/new-rough-diamond'].includes(pathname)
							// }
						>
							<MdLockOutline size={20} />
							{/* Lock Up All */}
							전체지갑 락 설정
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/lockup"
							className="link"
							activeClassName="active"
							// isActive={(_, { pathname }) => {
							//   return (
							//     pathname.includes('/faceted-diamond') ||
							//     pathname.includes('/updated-faceted-diamond')
							//   );
							// }}
						>
							<FaUserLock size={17} />
							{/* Lock Up User */}
							유저별 락 설정
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/notice"
							className="link"
							activeClassName="active"
							// isActive={(_, { pathname }) => {
							//   return (
							//     pathname.includes('/faceted-diamond') ||
							//     pathname.includes('/updated-faceted-diamond')
							//   );
							// }}
						>
							<TiClipboard size={20} />
							{/* Notice */}
							공지사항
						</NavLink>
					</li>
					<li>
						<a className="link" onClick={() => window.open(`${SCAN_URL}`, "_blank")}>
							<GoBrowser size={17} />
							{/* <div className="hyperlink">Scan</div> */}
							<div className="hyperlink">코인 탐색기</div>
						</a>
					</li>
					{/* <li>
            <NavLink
              to="/user-mining"
              className="link"
              activeClassName="active"
              // isActive={(_, { pathname }) => {
              //   return (
              //     pathname.includes('/faceted-diamond') ||
              //     pathname.includes('/updated-faceted-diamond')
              //   );
              // }}
            >
              <GiMining size={17} />
              User Mining
            </NavLink>
          </li> */}
					{/*<hr />
          <li>
            <NavLink
              to="/etherswap"
              className="link"
              activeClassName="active"
              style={{height: '30px'}}>
              <GiAirBalloon size={17} />
              ETH Swap Log
            </NavLink>
          </li>*/}
					<hr />
					<li>
						<div
							className="link"
							style={{
								fontSize: 15,
								bottom: "70px",
								flexDirection: "column",
								alignItems: "flex-start",
								cursor: "default",
								height: "25px",
							}}
						>
							{/* <div>Transfer To User</div> */}
							<div>코인 지급</div>
						</div>
					</li>
					<li>
						<NavLink to="/airdrop/XGP" className="link" activeClassName="active" style={{ height: "30px" }}>
							<GiAirBalloon size={17} />
							XGP
						</NavLink>
					</li>
					<hr />
					<li>
						<div
							className="link"
							style={{
								fontSize: 15,
								bottom: "70px",
								flexDirection: "column",
								alignItems: "flex-start",
								cursor: "default",
								height: "25px",
							}}
						>
							{/* <div>Transfer To Admin</div> */}
							<div>코인 회수</div>
						</div>
					</li>
					<li>
						<NavLink to="/airdrop-to-admin/XGP" className="link" style={{ height: "30px" }} activeClassName="active">
							<GiAirBalloon size={17} />
							XGP
						</NavLink>
					</li>
					<hr />
          <li>
            <div
              className="link"
              style={{
                fontSize: 15,
                bottom: "70px",
                flexDirection: "column",
                alignItems: "flex-start",
                cursor: "default",
                height: "25px",
              }}
            >
              {/* <div>Transfer To Admin</div> */}
              <div>쿠폰마켓</div>
            </div>
          </li>
          <li>
            <NavLink to="/coupon-market-history" className="link" style={{ height: "30px" }} activeClassName="active">
              <GiAirBalloon size={17} />
              쿠폰마켓구매내역
            </NavLink>
          </li>
          <hr />
					<li>
						<div
							className="link"
							style={{
								fontSize: 15,
								bottom: "70px",
								flexDirection: "column",
								alignItems: "flex-start",
								cursor: "default",
								height: "25px",
							}}
						>
							<div>관리자 설정</div>
						</div>
					</li>
					<li>
						<NavLink to="/adminlist" className="link" style={{ height: "30px" }} activeClassName="active">
							<FaUserCog size={17} />
							관리자 목록
						</NavLink>
						<NavLink to="/adminiplist" className="link" style={{ height: "30px" }} activeClassName="active">
							<GoDeviceDesktop size={17} />
							관리자 접속 IP 관리
						</NavLink>
					</li>
					{/*<hr />*/}

					{/*<li>*/}
					{/*	<div*/}
					{/*		className={`link ${!this.state.isFold && "active-link"}`}*/}
					{/*		onClick={this].handleToggleFold}>*/}
					{/*		<MdMoreHoriz size={19} />*/}
					{/*		More*/}
					{/*	</div>*/}
					{/*	<div className={`child ${!this.state.isFold && "show"}`}>*/}
					{/*		<div*/}
					{/*			className="hyperlink"*/}
					{/*			onClick={() => window.open(`${SCAN_URL}`, "_blank")}>*/}
					{/*			Scan*/}
					{/*		</div>*/}
					{/*	</div>*/}
					{/*</li>*/}
				</ul>

				<div
					className="link footer"
					style={{
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "center",
					}}
				>
					{/*<div*/}
					{/*	className=""*/}
					{/*	style={{*/}
					{/*		fontSize:      12,*/}
					{/*		color:         "lightGray",*/}
					{/*		bottom:        "70px",*/}
					{/*		flexDirection: "column",*/}
					{/*		cursor:        "default"*/}
					{/*	}}>*/}
					{/*	<div>BETA VERSION .</div>*/}
					{/*	<div>Last Update : 2020-01-23 21:15</div>*/}
					{/*</div>*/}

					<div className="" onClick={this.handleLogout}>
						<FiLogOut size={19} />
						{/* Log out */}
						로그아웃
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Navigation);
