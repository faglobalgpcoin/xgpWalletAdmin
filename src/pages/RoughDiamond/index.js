// import * as moment from 'moment';
// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { observer, inject } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
// import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
// import { orderBy } from '@progress/kendo-data-query';
// import { filterBy } from '@progress/kendo-data-query';
// import { MdCreate } from 'react-icons/md';
// import { IoIosTrash } from 'react-icons/io';
// import { FiPlus } from 'react-icons/fi';
// import { GoSearch } from 'react-icons/go';
// import { FiArrowUp } from 'react-icons/fi';
// import {
//   getDiamondBySerialNum,
//   deleteDiamond,
//   updateDiamond,
// } from '../../apis/diamond';
// import DiamondDetailModal from '../../components/DiamondDetailModal';
// import DIAMOND_STATE from '../../constants/diamond';
// import ConfirmModal from '../../components/ConfirmModal';
// import { storeOnBlockchain, getTokensOfOwner } from '../../utils/caverService';

// const RoughDiamond = ({ history, diamondStore, snackbarStore }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [selectedNum, setselectedNum] = useState([]);
//   const [confirmParams, setConfirmParams] = useState('');
//   const [modalMode, setModalMode] = useState('VIEW');
//   const [modalData, setModlaData] = useState({});
//   const [sort, setSort] = useState([{}]);
//   const [filterValue, setFilterValue] = useState('');
//   const [filter, setFilter] = useState({
//     logic: 'and',
//     filters: [{ field: 'serialNum', operator: 'contains', value: '' }],
//   });

//   const { roughDiamond, fetchRoughDiamond } = diamondStore;
//   const { t } = useTranslation();

//   useEffect(() => {
//     async function fetchInitialData() {
//       await fetchRoughDiamond();
//     }
//     fetchInitialData();
//   }, [fetchRoughDiamond]);

//   const handleOpenModal = async (serialNum, mode = 'VIEW') => {
//     const diamondData = await getDiamondBySerialNum(serialNum);

//     if (diamondData) {
//       setModalMode(mode);
//       setIsModalOpen(true);
//       setModlaData(diamondData);
//     }
//   };

//   const handleRowClick = (e) => {
//     const isSelected = selectedNum.findIndex(
//       (item) => item === e.dataItem.serialNum,
//     );

//     if (isSelected > -1) {
//       const prevNums = selectedNum;
//       prevNums.splice(isSelected, 1);
//       setselectedNum([...prevNums]);
//     } else {
//       setselectedNum([...selectedNum, e.dataItem.serialNum]);
//     }
//   };

//   const handleClickStore = async () => {
//     let txResult = [];
//     let tokens = [];
//     let result;
//     let data;
//     let tokensCount;

//     for (let i = 0; i < selectedNum.length; i++) {
//       let tempTx;

//       data = roughDiamond.find((item) => item.serialNum === selectedNum[i]);
//       tempTx = await storeOnBlockchain(
//         JSON.stringify({
//           ...data,
//           processStatus: DIAMOND_STATE.ROUGH_STORED,
//         }),
//       );

//       txResult.push(tempTx);
//     }

//     tokens = await getTokensOfOwner();
//     tokensCount = tokens.length - 1;

//     for (let j = tokensCount; j > tokensCount - selectedNum.length; j--) {
//       data = roughDiamond.find(
//         (item) => item.serialNum === selectedNum[tokensCount - j],
//       );
//       result = await updateDiamond({
//         ...data,
//         tokenId: tokens[j],
//         processStatus: DIAMOND_STATE.ROUGH_STORED,
//         roughStoredTxHash: txResult[tokensCount - j].transactionHash,
//       });
//     }

//     if (result) {
//       snackbarStore.activeSnackbar('Store Rough Diamond on Blockhain 💎');

//       setTimeout(() => {
//         fetchRoughDiamond();
//       }, 1500);
//     }
//   };

//   const openDeleteModal = (params) => {
//     setIsConfirmOpen(true);
//     setConfirmParams(params);
//   };

//   const handleDeleteDiamond = async (serialNum) => {
//     const result = await deleteDiamond(serialNum);

//     if (result) {
//       fetchRoughDiamond();
//       setIsConfirmOpen(false);
//       snackbarStore.activeSnackbar('Delete Rough Diamond draft!');
//     }
//   };

//   const handleChangeFilterValue = (e) => {
//     setFilterValue(e.target.value);
//   };

//   const handleClickSearch = () => {
//     const prevFilter = filter;
//     prevFilter.filters[0].value = filterValue;
//     setFilter(prevFilter);

//     fetchRoughDiamond();
//   };

//   const handlePressKey = (e) => {
//     if (e.key === 'Enter') {
//       handleClickSearch();
//     }
//   };

//   return (
//     <div className="content list-block">
//       <div className="content-title title-row">
//         <span>Rough Diamond List</span>
//       </div>
//       <div className="content-title title-row">
//         <div style={{ display: 'flex', flexDirection: 'row' }}>
//           <button
//             className="primary-button grid-button"
//             onClick={() => history.push('/new-rough-diamond')}
//           >
//             <FiPlus size={18} style={{ marginRight: 10 }} />
//             {t('new_rough_diamond')}
//           </button>
//           <button
//             className="secondary-button grid-button last"
//             onClick={handleClickStore}
//             disabled={selectedNum.length === 0}
//           >
//             <FiArrowUp size={18} style={{ marginRight: 10 }} />
//             Store On Blockchain
//           </button>
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'row' }}>
//           <input
//             type="text"
//             className="search-form"
//             placeholder="Search for Serial Number ..."
//             value={filterValue}
//             onChange={handleChangeFilterValue}
//             onKeyPress={handlePressKey}
//           />
//           <button
//             type="button"
//             className="search-button"
//             onClick={handleClickSearch}
//           >
//             <GoSearch size={18} style={{ marginRight: 10 }} />
//           </button>
//         </div>
//       </div>

//       <Grid
//         style={{ height: '83%', width: '100%' }}
//         data={filterBy(
//           orderBy(
//             roughDiamond.map((item) => ({
//               ...item,
//               selected: selectedNum.includes(item.serialNum),
//             })),
//             sort,
//           ),
//           filter,
//         )}
//         selectedField="selected"
//         onRowClick={handleRowClick}
//         onSortChange={(e) => setSort(e.sort)}
//         sort={sort}
//         resizable
//         sortable
//       >
//         <Column
//           field="serialNum"
//           title="Serial Number"
//           width="180px"
//           locked
//           cell={(props) => (
//             <td className="k-grid-content-sticky locked-left">
//               <span
//                 className="product-serial"
//                 onClick={() => handleOpenModal(props.dataItem[props.field])}
//               >
//                 {props.dataItem[props.field]}
//               </span>
//             </td>
//           )}
//         />
//         <Column
//           field="roughCreated"
//           title="Date"
//           width="210px"
//           cell={(props) => (
//             <td>
//               <span>
//                 {moment(props.dataItem[props.field] || '').format('LL')}
//               </span>
//             </td>
//           )}
//         />
//         <Column field="roughMeasurements" title="Measurements" width="180px" />
//         <Column field="roughCaratWeight" title="Carat Weight" width="180px" />
//         <Column field="roughColor" title="Color" width="140px" />
//         <Column
//           field="roughExpectedClarity"
//           title="Expected Clarity"
//           width="180px"
//         />
//         <Column
//           field="roughExpectedCarat"
//           title="Expected Carat"
//           width="180px"
//         />
//         <Column
//           title=""
//           width="180px"
//           locked
//           cell={(props) => (
//             <td className="k-grid-content-sticky locked-right">
//               <button
//                 className="simple-circle-button"
//                 style={{ marginLeft: 10 }}
//                 onClick={() =>
//                   handleOpenModal(props.dataItem.serialNum, 'EDIT')
//                 }
//               >
//                 <MdCreate size={20} />
//               </button>
//               <button
//                 className="simple-circle-button last"
//                 onClick={() => openDeleteModal(props.dataItem)}
//                 style={{ marginLeft: 10 }}
//               >
//                 <IoIosTrash size={20} />
//               </button>
//             </td>
//           )}
//         />
//       </Grid>
//       <DiamondDetailModal
//         mode={modalMode}
//         data={modalData}
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         refreshFunction={fetchRoughDiamond}
//       />
//       <ConfirmModal
//         message={`Are you sure you want to delete`}
//         params={confirmParams}
//         isOpen={isConfirmOpen}
//         setIsOpen={setIsConfirmOpen}
//         confirmFunction={handleDeleteDiamond}
//       />
//     </div>
//   );
// };

// export default inject(
//   'diamondStore',
//   'snackbarStore',
// )(withRouter(observer(RoughDiamond)));
