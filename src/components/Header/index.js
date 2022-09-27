import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { MdPerson, MdMenu } from "react-icons/md";
import { getCookie, decodeCookieData } from "../../utils/auth";

import { SCAN_URL } from "../../constants/api";

const Header = () => {
	let cookieData = decodeCookieData(getCookie("key"));

	const [mobileNav, setmobileNav] = useState("");
	const viewMobileNav = () => {
		setmobileNav("active");
	};
	const hiddenMobileNav = () => {
		setmobileNav("");
	};

	const gotoMain = () => {
		document.location.href = "/";
	};

	return (
		<div className="header-container">
			<div className="pc header-pc">
				<div className="flex-row">
					<p className="profile-title">{cookieData.username}</p>
					<div className="image-container">
						<MdPerson size={17} style={{ color: "white" }} />
					</div>
				</div>
				<div className="divider" />
				<button type="button" className="lang-button">
					<span role="img" aria-label="america">
						🇱🇷
					</span>
				</button>
			</div>
			{/* mobile */}
			<div className="mobile header-mobile">
				<div className="mobile-header">
					<div className="mobile-logo">
						<div className="gotoMain" onClick={() => gotoMain()}>
							<img src={require("../../imgs/intro_moon.png")} alt="logo" height={50} />
						</div>
					</div>
					<div className="flex-row">
						<p className="profile-title">{cookieData.username}</p>
						<div className="image-container">
							<MdPerson size={17} style={{ color: "white" }} />
						</div>
						<button type="button" className="mobile-menu-icon" onClick={() => viewMobileNav()}>
							<MdMenu size={25} />
						</button>
					</div>
				</div>
				<div className={`mobile-nav ${mobileNav}`}>
					<div className="mobile-nav-title" onClick={() => hiddenMobileNav()}>
						<span>X</span>
						<p>MENU</p>
					</div>
					<ul className="mobile-nav-ul">
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/wallet-properties" className="link" activeClassName="active">
								지갑 환경설정
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/wallet-prop-amount" className="link" activeClassName="active">
								관리지갑
							</NavLink>
						</li>
						<hr />
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/users" className="link" activeClassName="active">
								유저
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/transferlist" className="link" activeClassName="active">
								전송내역
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/lockup-all" className="link" activeClassName="active">
								전체지갑 락 설정
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/lockup" className="link" activeClassName="active">
								유저별 락 설정
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/notice" className="link" activeClassName="active">
								공지사항
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<a className="link" onClick={() => window.open(`${SCAN_URL}`, "_blank")}>
								<div className="hyperlink">코인 탐색기</div>
							</a>
						</li>
						<hr />
						<li>
							<div className="link-title">코인 지급</div>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/airdrop/XGP" className="link" activeClassName="active">
								XGP
							</NavLink>
						</li>
						<hr />
						<li>
							<div className="link-title">코인 회수</div>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/airdrop-to-admin/XGP" className="link" activeClassName="active">
								XGP
							</NavLink>
						</li>
						<hr />
						<li>
							<div className="link-title">쿠폰마켓</div>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/coupon-market-history" className="link" activeClassName="active">
								쿠폰마켓구매내역
							</NavLink>
						</li>
						<hr />
						<li>
							<div className="link-title">관리자 설정</div>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/adminlist" className="link" activeClassName="active">
								관리자 목록
							</NavLink>
						</li>
						<li onClick={() => hiddenMobileNav()}>
							<NavLink to="/adminiplist" className="link" activeClassName="active">
								관리자 접속 IP 관리
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Header;
