import React, { useState, useEffect } from "react";
import {decodeCookieData, getCookie, resetCookie} from "../utils/auth";
import {checkUserRole} from "../apis/auth";
import {withRouter} from "react-router";
import {deleteAdminUser, getAdminUsers, modifyAdminUser, registerAdminUser} from "../apis/admin";

function AdminList({history}) {
	const [popup, popupSet] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [properties, setProperties] = useState(false);
  const [transferHistory, setTransferHistory] = useState(false);
  const [lockUpAll, setLockUpAll] = useState(false);
  const [lockUpUser, setLockUpUser] = useState(false);
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [type, setType] = useState("");

  function viewPopup(props, type) {
		popupSet("active");
		if (props && type === "modify") {
      setActive(props.active);
      setUserId(props.userId);
      setName(props.name);
      setLevel(props.level);
      setProperties(props.permissions.properties);
      setTransferHistory(props.permissions.transferHistory);
      setLockUpAll(props.permissions.lockUpAll);
      setLockUpUser(props.permissions.lockUpUser);
      setId(props.id);
      setType("modify");
    } else {
		  setType("add");
		  setLevel(1);
    }
	}

	function closePopup() {
		popupSet("");
    setActive(false);
    setUserId("");
    setName("");
    setLevel("");
    setProperties(false);
    setTransferHistory(false);
    setLockUpAll(false);
    setLockUpUser(false);
    setId("");
    setType("");
	}

	const handleOnChange = (e) => {
	  switch(e.target.name) {
      case "id":
        if (e.target.checked) setId(e.target.value);
        else setId("");
        break;
      case "userId":
        setUserId(e.target.value);
        break;
      case "admin-active":
        setActive(true);
        break;
      case "admin-nonactive":
        setActive(false);
        break;
      case "level":
        setLevel(e.target.value);
        break;
      case "properties":
        setProperties(e.target.checked);
        break;
      case "transferHistory":
        setTransferHistory(e.target.checked);
        break;
      case "lockUpAll":
        setLockUpAll(e.target.checked);
        break;
      case "lockUpUser":
        setLockUpUser(e.target.checked);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "name":
        setName(e.target.value);
        break;
      default:
        break;
    }
  }

  const fetchData = async () => {
    const cookieData = decodeCookieData(getCookie("key"));
    const userResponse = await checkUserRole(cookieData.accessToken);

    if (!userResponse.data.active) {
      resetCookie();
      history.push("/");
    }

    if (userResponse.data.level !== 10) {
      alert('Please check your account again');
      history.push('/');
      return;
    }

    const response = await getAdminUsers(cookieData.accessToken);

    if (!response) {
      return;
    }

    if (response && response.data) {
      setUsers(response.data);
    }
  };

	useEffect(() => {
	  fetchData();
  }, []);

	const listHtml = (props) => {
    const {id, active, userId, name, level, permissions} = props;
	  return (
      <tr key={id} >
        <td>
          <input type="checkbox" name="id" onChange={handleOnChange} value={id} />
        </td>
        <td>
          {active ? (<p className="active-admin">Y</p>) : <p className="non-admin">N</p> }
        </td>
        <td>{userId}</td>
        <td>{name}</td>
        <td>{level}</td>
        <td className="env-setting">
          <label htmlFor="site-env-setting">
            <input type="checkbox" id="site-env-setting" checked={permissions.properties} disabled onChange={handleOnChange} />
            <p>????????????</p>
          </label>
          <label htmlFor="transfer-setting">
            <input type="checkbox" id="transfer-setting" checked={permissions.transferHistory} disabled onChange={handleOnChange} />
            <p>????????????</p>
          </label>
          <label htmlFor="wallet-lock-setting">
            <input type="checkbox" id="wallet-lock-setting" checked={permissions.lockUpAll} disabled onChange={handleOnChange} />
            <p>?????????????????????</p>
          </label>
          <label htmlFor="user-wallet-lock-setting">
            <input type="checkbox" id="user-wallet-lock-setting" checked={permissions.lockUpUser} disabled onChange={handleOnChange} />
            <p>???????????????</p>
          </label>
        </td>
        <td className="edit-button">
          <button onClick={() => {
            viewPopup(props, "modify");
          }}>??????</button>
          {/*??? ?????? ????????? content-modal??? class??????(className = active) */}
        </td>
      </tr>
    )
  }

  const onSubmit = async () => {
	  let result;
    const cookieData = decodeCookieData(getCookie("key"));
    const userResponse = await checkUserRole(cookieData.accessToken);

    if (!userResponse.data.active) {
      resetCookie();
      history.push("/");
    }

    if (userResponse.data.level !== 10) {
      alert('Please check your account again');
      history.push('/users');
      return;
    }

    if (type === "add") {
      result = await registerAdminUser(cookieData.accessToken, {
        userId,
        password,
        name,
        level,
        active,
        permissions: {
          properties,
          transferHistory,
          lockUpAll,
          lockUpUser
        }
      });
    } else {
      result = await modifyAdminUser(cookieData.accessToken, {
        id,
        password,
        name,
        level,
        active,
        permissions: {
          properties,
          transferHistory,
          lockUpAll,
          lockUpUser
        }
      });
    }

    if (result && result.status === "success") {
      fetchData();
      closePopup();
    } else {
      alert("????????? ????????? ??????????????????.");
    }
  }

  const onDeleteSubmit = async () => {
    let result;

    const cookieData = decodeCookieData(getCookie("key"));
    const userResponse = await checkUserRole(cookieData.accessToken);

    if (!userResponse.data.active) {
      resetCookie();
      history.push("/");
    }

    if (userResponse.data.level !== 10) {
      alert('Please check your account again');
      history.push('/users');
      return;
    }

    if (id === "") {
      alert("????????? ???????????? ??????????????????.");
      return;
    }

    result = await deleteAdminUser(cookieData.accessToken, {
      id
    });

    if (result && result.status === "success") {
      fetchData();
    } else {
      alert("????????? ????????? ??????????????????.");
    }
  }

	return (
		<div className="content">
			<div className="content-title title-row">
				<span>????????? ??????</span>
				<div className="button-list">
					<button className="addAdmin" onClick={() => {
					  viewPopup(null, "add");
					}}>
						????????? ??????
					</button>
					{/*??? ?????? ????????? content-modal??? class??????(className = active) */}
					<button className="delAdmin" onClick={onDeleteSubmit}>?????? ??????</button>
				</div>
			</div>
      {/* ?????? name or mobile ????????? modal addClass(active) */}
			<div className="content-items">
				<div className="content-items-table">
					<table>
						<thead>
							<tr>
								<th>
									<input type="checkbox" />
								</th>
								<th>??????</th>
								<th>?????????</th>
								<th>??????</th>
								<th>??????</th>
								<th>??????</th>
								<th>??????</th>
							</tr>
						</thead>
						<tbody>
              {users.map((v) => {
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
							<tbody>
								<tr>
									<th>??????</th>
									<td className="table-label">
										<label htmlFor="admin-active">
											<input type="radio" name="admin-active" id="admin-active" checked={active} onChange={handleOnChange} />
											<p>??????</p>
										</label>
										<label htmlFor="admin-nonactive">
											<input type="radio" name="admin-nonactive" id="admin-nonactive" checked={!active} onChange={handleOnChange} />
											<p>?????????</p>
										</label>
									</td>
								</tr>
								<tr>
									<th>ID</th>
									<td>
										<input type="text" placeholder="?????????" name="userId" value={userId} readOnly={type === "modify"} onChange={handleOnChange} />
									</td>
								</tr>
								<tr>
									<th>????????????</th>
									<td>
										<input type="password" name="password" placeholder="????????????" value={password} onChange={handleOnChange} />
									</td>
								</tr>
								<tr>
									<th>??????</th>
									<td>
										<input type="text" name="name" placeholder="??????" value={name} onChange={handleOnChange} />
									</td>
								</tr>
								<tr>
									<th>??????</th>
									<td>
										<select name="level" value={level} onChange={handleOnChange}>
											<option value="1">?????? 1</option>
											<option value="10">?????? 10</option>
										</select>
										<p>??????1 : ?????????????????? ????????? ?????? / ?????? 10 : ?????? ??????</p>
									</td>
								</tr>
								<tr>
									<th>????????????</th>
									<td className="table-label">
										<label htmlFor="admin-edit-value-env">
											<input type="checkbox" name="properties" id="admin-edit-value-env" checked={properties} onChange={handleOnChange} />
											<p>????????????</p>
										</label>
										<label htmlFor="admin-edit-value-transfer">
											<input type="checkbox" name="transferHistory" id="admin-edit-value-transfer" checked={transferHistory} onChange={handleOnChange} />
											<p>????????????</p>
										</label>
										<label htmlFor="admin-edit-value-alllock">
											<input type="checkbox" name="lockUpAll" id="admin-edit-value-alllock" checked={lockUpAll} onChange={handleOnChange} />
											<p>?????????????????????</p>
										</label>
										<label htmlFor="admin-edit-value-userlock">
											<input type="checkbox" name="lockUpUser" id="admin-edit-value-userlock" checked={lockUpUser} onChange={handleOnChange} />
											<p>????????? ??????</p>
										</label>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="content-modal-items-button">
						<div className="content-modal-items-button-item">
							<button className="modal-cancel" onClick={closePopup}>
								?????????
							</button>
							<button className="modal-submit" onClick={onSubmit}>{type === "add" ? "??????" : "??????"}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRouter(AdminList);
