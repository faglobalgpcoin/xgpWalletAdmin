import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { inject } from "mobx-react";
import { observer } from "mobx-react";

import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Snackbar from "./components/Snackbar";
import AppProperty from "./pages/AppProperty";
import NewAppProperty from "./pages/NewAppProperty";
import Users from "./pages/Users";
import UserLockUp from "./pages/UserLockUp";
import Template from "./pages/Template";
import LockUpAll from "./pages/LockUpAll";
import AirdropTransfer from "./pages/AirdropTransfer";
import AirdropTransferForAdmin from "./pages/AirdropTransferForAdmin";
import UserMining from "./pages/UserMining";
import NoticePage from "./pages/Notice/NoticePage";
import PostUpdatePage from "./pages/Notice/PostUpdatePage";
import PostWritePage from "./pages/Notice/PostWritePage";
import EtherSwap from "./pages/EtherSwap";
// 코인수량 세부 추가
import AppPropertyBalance from "./pages/AppPropertyBalance";
// 쿠폰마켓 구매내역 추가
import CouponMarketHistory from "./pages/CouponMarketHistory";

// 신규페이지
import TransferList from "./pages/TransferList";
import AdminList from "./pages/AdminList";
import AdminIpList from "./pages/AdminIpList";

const MainRouter = ({ match, snackbarStore }) => {
	const { isActive, message, handleClick } = snackbarStore;

	return (
		<>
			<Navigation />
			<Header />
			<Snackbar isActive={isActive} message={message} handleClick={handleClick} isDismiss={true} dismissTime={4000} />
			<Switch>
				<Route exact path={`${match.url}`}>
					<Redirect to="/wallet-properties" />
				</Route>
				<Route path={`${match.url}wallet-properties`} component={AppProperty} />
				<Route path={`${match.url}new-property`} component={NewAppProperty} />
				<Route path={`${match.url}modify-property/:id`} component={NewAppProperty} />
				<Route path={`${match.url}users`} component={Users} />
				<Route path={`${match.url}user-mining`} component={UserMining} />
				<Route path={`${match.url}lockup-all`} component={LockUpAll} />
				<Route path={`${match.url}lockup`} component={UserLockUp} />
				<Route path={`${match.url}etherswap`} component={EtherSwap} />
				<Route path={`${match.url}airdrop/:tokenSymbol`} component={AirdropTransfer} />
				<Route path={`${match.url}airdrop-to-admin/:tokenSymbol`} component={AirdropTransferForAdmin} />
				<Route exact path={`${match.url}notice`} component={NoticePage} />
				<Route path={`${match.url}notice/write`} component={PostWritePage} />
				<Route path={`${match.url}notice/update/:postId`} component={PostUpdatePage} />
				<Route path={`${match.url}faq`} component={Template} />
				<Route path={`${match.url}setting`} component={Template} />
				{/* 신규페이지 */}
				<Route path={`${match.url}transferlist`} component={TransferList} />
				<Route path={`${match.url}adminlist`} component={AdminList} />
				<Route path={`${match.url}adminiplist`} component={AdminIpList} />
				{/* 신규페이지 추가 210222 */}
				<Route path={`${match.url}wallet-prop-amount`} component={AppPropertyBalance} />
				{/* 쿠폰마켓구매내역 추가 210303 */}
				<Route path={`${match.url}coupon-market-history`} component={CouponMarketHistory} />

				{/* <Route component={NoMatch} /> */}
			</Switch>
		</>
	);
};

export default inject("snackbarStore")(observer(MainRouter));
