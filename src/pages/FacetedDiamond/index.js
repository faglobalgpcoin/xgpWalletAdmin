// import * as moment from 'moment';
// import React, { useEffect, useState, useMemo } from 'react';
// import { observer, inject } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
// import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
// import { filterBy } from '@progress/kendo-data-query';
// import { MdCreate } from 'react-icons/md';
// import { IoIosTrash } from 'react-icons/io';
// import { FiPlus } from 'react-icons/fi';
// import { FiArrowUp } from 'react-icons/fi';
// import { GiStoneBlock } from 'react-icons/gi';
// import { GoSearch } from 'react-icons/go';
// import {
//   getDiamondBySerialNum,
//   deleteDiamond,
//   updateDiamond,
// } from '../../apis/diamond';
// import DIAMOND_STATE from '../../constants/diamond';
// import { addMetadataOnBlockchain } from '../../utils/caverService';
// import DiamondDetailModal from '../../components/DiamondDetailModal';

// const FacetedDiamond = ({ history, diamondStore, snackbarStore }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState('VIEW');
//   const [selectedNum, setselectedNum] = useState([]);
//   const [modalData, setModlaData] = useState({});
//   const [filterValue, setFilterValue] = useState('');
//   const [filter, setFilter] = useState({
//     logic: 'and',
//     filters: [{ field: 'serialNum', operator: 'contains', value: '' }],
//   });

//   const {
//     roughStoredDiamondFromDB,
//     facetedDiamond,
//     fetchFacetedDiamond,
//     fetchRoughStoredDiamond,
//   } = diamondStore;

//   useEffect(() => {
//     async function fetchInitialData() {
//       await fetchRoughStoredDiamond();
//       await fetchFacetedDiamond();
//     }
//     fetchInitialData();
//   }, [fetchRoughStoredDiamond, fetchFacetedDiamond]);

//   const gridData = useMemo(
//     () => [...roughStoredDiamondFromDB, ...facetedDiamond],
//     [roughStoredDiamondFromDB, facetedDiamond],
//   );

//   const facetSerialArray = useMemo(() => {
//     return facetedDiamond
//       .filter((dataItem) => dataItem.processStatus === 'FACETED_DRAFT')
//       .map((dataItem) => dataItem.serialNum);
//   }, [facetedDiamond]);

//   const handleClickSearch = () => {
//     const prevFilter = filter;
//     prevFilter.filters[0].value = filterValue;
//     setFilter(prevFilter);
//     fetchRoughStoredDiamond();
//     fetchFacetedDiamond();
//   };

//   const handleChangeFilterValue = (e) => {
//     setFilterValue(e.target.value);
//   };

//   const handlePressKey = (e) => {
//     if (e.key === 'Enter') {
//       handleClickSearch();
//     }
//   };

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

//     if (facetSerialArray.includes(e.dataItem.serialNum)) {
//       if (isSelected > -1) {
//         const prevNums = selectedNum;
//         prevNums.splice(isSelected, 1);
//         setselectedNum([...prevNums]);
//       } else {
//         setselectedNum([...selectedNum, e.dataItem.serialNum]);
//       }
//     }
//   };

//   const handleDeleteDiamond = async (data) => {
//     const result = await deleteDiamond(data);
//     if (result) {
//       fetchFacetedDiamond();
//       snackbarStore.activeSnackbar('Delete Faceted Diamond draft!');
//     }
//   };

//   const handleClickStore = async () => {
//     let result;
//     let data;

//     for (let i = 0; i < selectedNum.length; i++) {
//       let txTemp;
//       data = gridData.find((item) => item.serialNum === selectedNum[i]);
//       data.processStatus = DIAMOND_STATE.FACETED_STORED;

//       txTemp = await addMetadataOnBlockchain(parseInt(data.tokenId), data);
//       data.facetedStoredTxHash = txTemp.transactionHash;

//       result = await updateDiamond(data);
//     }

//     if (result) {
//       snackbarStore.activeSnackbar('Store Faceted Diamond on Blockhain 💎');

//       setTimeout(() => {
//         fetchFacetedDiamond();
//       }, 1500);
//     }
//   };

//   return (
//     <div className="content list-block">
//       <div className="content-title title-row">
//         <span>Faceted Diamond List</span>
//       </div>
//       <div className="content-title title-row">
//         <div style={{ display: 'flex', flexDirection: 'row' }}>
//           <button
//             className="secondary-button grid-button"
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
//         selectedField="selected"
//         data={filterBy(
//           gridData.map((item) => ({
//             ...item,
//             selected:
//               selectedNum.includes(item.serialNum) &&
//               facetSerialArray.includes(item.serialNum),
//           })),
//           filter,
//         )}
//         onRowClick={handleRowClick}
//         resizable
//       >
//         <Column
//           field="serialNum"
//           title="Serial Number"
//           width="180px"
//           locked
//           cell={(props) => (
//             <td className={`k-grid-content-sticky locked-left`}>
//               <span
//                 className="product-serial"
//                 onClick={() => handleOpenModal(props.dataItem[props.field])}
//               >
//                 {/* {console.log(props.dataItem)} */}
//                 {props.dataItem.processStatus ===
//                   DIAMOND_STATE.ROUGH_STORED && (
//                   <GiStoneBlock
//                     size={15}
//                     style={{ marginBottom: '-3px', marginRight: '5px' }}
//                   />
//                 )}
//                 {props.dataItem[props.field]}
//               </span>
//             </td>
//           )}
//         />
//         <Column
//           field="facetedCreated"
//           title="Date"
//           width="210px"
//           cell={(props) => (
//             <td>
//               {props.dataItem.processStatus !== DIAMOND_STATE.ROUGH_STORED ? (
//                 <span>{moment(props.dataItem[props.field]).format('LL')}</span>
//               ) : (
//                 <span className="absolute-message">
//                   Please enter the facet information
//                 </span>
//               )}
//             </td>
//           )}
//         />
//         <Column field="facetedClient" title="Client" width="180px" />
//         <Column
//           field="facetedCuttingShape"
//           title="Cutting Shape"
//           width="180px"
//         />
//         <Column field="facetedCaratWeight" title="Carat Weight" width="180px" />
//         <Column field="facetedColor" title="Color" width="140px" />
//         <Column
//           field="facetedExpectedClarity"
//           title="Expected Clarity"
//           width="180px"
//         />
//         <Column
//           field="facetedExpectedCarat"
//           title="Expected Carat"
//           width="180px"
//         />
//         <Column
//           title=""
//           width="180px"
//           locked
//           cell={(props) => (
//             <td className="k-grid-content-sticky locked-right">
//               {props.dataItem.processStatus === DIAMOND_STATE.FACETED_DRAFT ? (
//                 <>
//                   <button
//                     className="simple-circle-button"
//                     style={{ marginLeft: 10 }}
//                     onClick={() =>
//                       handleOpenModal(props.dataItem.serialNum, 'EDIT')
//                     }
//                   >
//                     <MdCreate size={20} />
//                   </button>
//                   {/* <button
//                     className="simple-circle-button last"
//                     onClick={() => handleDeleteDiamond(props.dataItem)}
//                     style={{ marginLeft: 10 }}
//                   >
//                     <IoIosTrash size={20} />
//                   </button> */}
//                 </>
//               ) : (
//                 <>
//                   <button
//                     className="primary-button grid-button last"
//                     // disabled={selectedNum === ''}
//                     onClick={() =>
//                       history.push(
//                         '/updated-faceted-diamond/' + props.dataItem.serialNum,
//                       )
//                     }
//                   >
//                     <FiPlus size={18} style={{ marginRight: 10 }} />
//                     Facet Info
//                   </button>
//                 </>
//               )}
//             </td>
//           )}
//         />
//       </Grid>
//       <DiamondDetailModal
//         mode={modalMode}
//         data={modalData}
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         refreshFunction={fetchFacetedDiamond}
//       />
//     </div>
//   );
// };

// export default inject(
//   'diamondStore',
//   'snackbarStore',
// )(withRouter(observer(FacetedDiamond)));
