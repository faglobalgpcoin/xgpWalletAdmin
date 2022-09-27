// import * as moment from 'moment';
// import React, { useEffect, useState } from 'react';
// import { observer, inject } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
// import { DropDownList } from '@progress/kendo-react-dropdowns';
// import { getAllRoughStone } from '../../apis/stone';
// import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
// import { FiPlus } from 'react-icons/fi';
// import { MdClose } from 'react-icons/md';
// import { MdCreate } from 'react-icons/md';
// import { filterBy } from '@progress/kendo-data-query';
// import DropdownItem from '../../components/List/DropdownItem';

// const initialFilter = {
//   logic: 'and',
//   filters: [],
// };

// const categories = [
//   { text: 'All', id: 0 },
//   { text: 'Rough', id: 1 },
//   { text: 'Faceted', id: 2 },
// ];

// const List = ({ history, productStore }) => {
//   const [gridData, setGridData] = useState([]);
//   const [gridFilter, setGridFilter] = useState(initialFilter);
//   const [dropdownValue, setDropdownValue] = useState(categories[0]);

//   useEffect(() => {
//     async function dataFetch() {
//       const roughStoneData = await getAllRoughStone();
//       const catRoughStoneData = roughStoneData.map((data) => ({
//         ...data,
//         category: 'rough',
//       }));

//       setGridData([...catRoughStoneData]);
//       productStore.setRoughStones(roughStoneData);
//     }

//     dataFetch();
//   }, [productStore]);

//   const handleChangeFilter = (event) => {
//     setDropdownValue(event.target.value);

//     switch (event.target.value.id) {
//       case 0:
//         setGridFilter({
//           logic: 'and',
//           filters: [],
//         });
//         break;
//       case 1:
//         setGridFilter({
//           logic: 'and',
//           filters: [
//             { field: 'category', operator: 'contains', value: 'rough' },
//           ],
//         });
//         break;
//       case 2:
//         setGridFilter({
//           logic: 'and',
//           filters: [
//             { field: 'ProductName', operator: 'contains', value: 'faceted' },
//           ],
//         });
//         break;
//       default:
//         setGridFilter({
//           logic: 'and',
//           filters: [],
//         });
//         break;
//     }
//   };

//   return (
//     <div className="content list-block">
//       <div className="content-title title-row">
//         <span>Product List</span>
//         <div className="dropdown-container">
//           <DropDownList
//             data={categories}
//             textField="text"
//             dataItemKey="id"
//             popupSettings={{ width: '140px' }}
//             itemRender={DropdownItem}
//             value={dropdownValue}
//             onChange={handleChangeFilter}
//           />
//         </div>
//       </div>

//       <Grid
//         style={{ height: '90%', width: '100%' }}
//         data={filterBy([...gridData], gridFilter)}
//         resizable
//       >
//         {/* <Column field="stoneId" title="" width="120px" /> */}
//         <Column field="category" title="Category" width="120px" />
//         <Column
//           field="serialNum"
//           title="Serial Number"
//           width="180px"
//           cell={(props) => (
//             <td>
//               <span className="product-serial">
//                 {props.dataItem[props.field]}
//               </span>
//             </td>
//           )}
//         />
//         <Column
//           field="createdAt"
//           title="Date"
//           width="180px"
//           cell={(props) => (
//             <td>
//               <span>
//                 {moment(props.dataItem[props.field] || '').format('LL')}
//               </span>
//             </td>
//           )}
//         />
//         <Column field="caratWeight" title="Carat Weight" width="180px" />
//         <Column field="color" title="Color" width="180px" />
//         <Column
//           field="expectedClarity"
//           title="Expected Clarity"
//           width="180px"
//         />
//         <Column field="expectedCarat" title="Expected Carat" width="180px" />
//         <Column
//           title=""
//           width="310px"
//           locked
//           cell={(props) => (
//             <td className="k-grid-content-sticky custom-locked">
//               <button
//                 className="primary-button grid-button"
//                 onClick={() =>
//                   history.push('/add-product/' + props.dataItem.stoneId)
//                 }
//               >
//                 <FiPlus size={18} style={{ marginRight: 10 }} />
//                 Faceting Info
//               </button>
//               <button
//                 className="simple-circle-button"
//                 onClick={() => alert('수정')}
//                 style={{ marginLeft: 10 }}
//               >
//                 <MdCreate size={20} />
//               </button>
//               <button
//                 className="simple-circle-button last"
//                 onClick={() => alert('삭제')}
//                 style={{ marginLeft: 10 }}
//               >
//                 <MdClose size={20} />
//               </button>
//             </td>
//           )}
//         />
//       </Grid>
//     </div>
//   );
// };

// export default inject('productStore')(observer(withRouter(List)));
