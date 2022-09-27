import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { MdCreate } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
// import { IoIosTrash } from 'react-icons/io';

import { getAppProperties } from "../apis/appProperty";
import { decodeCookieData, getCookie } from "../utils/auth";

const AppProperty = ({ history }) => {
	const [properties, setProperties] = useState([]);

	const excludeLockUp = (element) => {
		return element.keyName !== "lock_up_all";
	};

	useEffect(() => {
		async function fetchData() {
			const cookieData = decodeCookieData(getCookie("key"));
			const response = await getAppProperties(cookieData.accessToken);

			if (!response) {
				return;
			}

			if (response.data) {
				const data = response.data.filter(excludeLockUp);
				setProperties(data);
			}
		}

		fetchData();
	}, []);

	return (
		<div className="content">
			<div className="content-title title-row">
				{/* <span>Wallet Property</span> */}
				<span>지갑 환경설정</span>
				<button className="primary-button grid-button" onClick={() => history.push("/new-property")}>
					<FiPlus size={18} style={{ marginRight: 10 }} />
					{/* {"Create New"} */}
					{"새로 만들기"}
				</button>
			</div>
			<Grid
				style={{ height: "90%", width: "100%" }}
				data={properties}
				// onSortChange={(e) => setSort(e.sort)}
				// sort={sort}
				resizable
				// sortable
			>
				<Column field="id" title="Id" width="480px" />
				<Column field="keyName" title="Key Name" width="380px" />
				<Column field="value" title="Value" width="588px" />
				<Column
					title=""
					width="120px"
					// locked
					cell={(props) => (
						<td className="k-grid-content-sticky locked-right">
							<button
								className="simple-circle-button"
								style={{ marginLeft: 10 }}
								onClick={() => history.push("/modify-property/" + props.dataItem.id)}
								// onClick={() =>
								//   handleOpenModal(props.dataItem.serialNum, 'EDIT')
								// }
							>
								<MdCreate size={20} />
							</button>
							{/* <button
                            className="simple-circle-button last"
                            // onClick={() => openDeleteModal(props.dataItem)}
                            style={{ marginLeft: 10 }}
                        >
                            <IoIosTrash size={20} />
                        </button> */}
						</td>
					)}
				/>
			</Grid>
		</div>
	);
};

export default AppProperty;
