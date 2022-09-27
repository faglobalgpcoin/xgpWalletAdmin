// import * as moment from 'moment';
// import React, { useState, useEffect } from 'react';
// import useForm from 'react-hook-form';
// import DatePicker from 'react-datepicker';
// import { withRouter } from 'react-router-dom';
// import { roughDiamondGenerate } from '../../utils/generator';
// import { registerRoughDiamond } from '../../apis/diamond';
// import { IoIosClose } from 'react-icons/io';
// import { uploadToS3 } from '../../utils/file';
// import { FiArrowLeft } from 'react-icons/fi';
// import { IoIosWarning } from 'react-icons/io';
// import { inject, observer } from 'mobx-react';
// import { storeOnBlockchain, getTokensOfOwner } from '../../utils/caverService';
// import DIAMOND_STATE from '../../constants/diamond';
// import 'react-datepicker/dist/react-datepicker.css';

// function NewDiamond({ match, history, diamondStore, snackbarStore }) {
//   const [date, setDate] = useState(new Date());
//   const [formFiles, setFormFiles] = useState([]);

//   const { register, handleSubmit, errors, getValues } = useForm();

//   useEffect(() => {}, [history, diamondStore]);

//   const handleChange = (date) => {
//     setDate(date);
//   };

//   const handleChangeFile = (e) => {
//     const currentFile = e.target.files[0];
//     setFormFiles((prev) => [...prev, currentFile]);
//   };

//   const handleDeleteFile = (index) => {
//     const prevFiles = formFiles;
//     prevFiles.splice(index, 1);
//     setFormFiles([...prevFiles]);
//   };

//   const uploadRegisteredFiles = async () => {
//     let tempArr = [];

//     for (let i = 0; i < formFiles.length; i++) {
//       const response = await uploadToS3(formFiles[i]);
//       tempArr.push(response.url);
//     }

//     return tempArr;
//   };

//   const registerToDatabase = async (data) => {
//     let result;

//     if (data.serialNum === 'test') {
//       const tempRoughDiamond = roughDiamondGenerate();
//       result = await registerRoughDiamond(tempRoughDiamond);
//     } else {
//       const uploadedUrlArr = await uploadRegisteredFiles();
//       result = await registerRoughDiamond({
//         ...data,
//         roughCreated: moment(date).format('LL'),
//         roughAnalysisImages: uploadedUrlArr,
//       });
//     }

//     return result;
//   };

//   const onSubmit = async (data) => {
//     const result = await registerToDatabase(data);

//     if (result) {
//       snackbarStore.activeSnackbar(
//         'Rough Diamond Information saved successfully!',
//       );
//       diamondStore.fetchRoughDiamond();
//       history.goBack();
//     }
//   };

//   const handleStore = async () => {
//     let tokens;
//     let txResult;
//     let data = getValues();

//     txResult = await storeOnBlockchain(JSON.stringify(data));
//     tokens = await getTokensOfOwner();

//     if (tokens) {
//       data.processStatus = DIAMOND_STATE.ROUGH_STORED;
//       data.tokenId = tokens[tokens.length - 1];
//       data.roughStoredTxHash = txResult.transactionHash;

//       await registerToDatabase(data);

//       snackbarStore.activeSnackbar(
//         'Rough Diamond Information saved successfully!',
//       );
//       diamondStore.fetchRoughDiamond();
//       history.goBack();
//     }
//   };

//   return (
//     <div className="scroll-content">
//       <div className="padding-container">
//         <div className="content-title">
//           <button className="back-button" onClick={() => history.goBack()}>
//             <FiArrowLeft size={25} />
//           </button>
//           <span>New Rough Diamond</span>
//         </div>

//         <div className="add-diamond-container">
//           <div className="half-block">
//             <form className="form" onSubmit={handleSubmit(onSubmit)}>
//               <div className="row">
//                 <div className="title">IRGL Serial Number</div>
//                 <div className="input-container">
//                   <input
//                     type="text"
//                     className="register-input"
//                     name="serialNum"
//                     ref={register({ required: true, maxLength: 80 })}
//                   />
//                   {errors.serialNum && (
//                     <span className="error-msg">
//                       <IoIosWarning size={15} />
//                       This field is required
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="title">Measurements</div>
//                 <input
//                   type="text"
//                   className="register-input"
//                   name="roughMeasurements"
//                   ref={register}
//                 />
//                 <span className="unit">mm</span>
//               </div>
//               <div className="row">
//                 <div className="title">Carat Weight</div>
//                 <input
//                   type="text"
//                   className="register-input"
//                   name="roughCaratWeight"
//                   ref={register}
//                 />
//               </div>
//               <div className="row">
//                 <div className="title">Color</div>
//                 <input
//                   type="text"
//                   className="register-input"
//                   name="roughColor"
//                   ref={register}
//                 />
//               </div>
//               <div className="row">
//                 <div className="title">Expected Clarity</div>
//                 <input
//                   type="text"
//                   className="register-input"
//                   name="roughExpectedClarity"
//                   ref={register}
//                 />
//               </div>
//               <div className="row">
//                 <div className="title image-title">Expected Carat</div>
//                 <input
//                   type="text"
//                   className="register-input"
//                   name="roughExpectedCarat"
//                   ref={register}
//                 />
//                 <span className="unit">carat</span>
//               </div>
//               <div className="row">
//                 <div className="title">Date</div>
//                 <DatePicker
//                   dateFormat="MMMM d, yyyy"
//                   className="register-input"
//                   selected={date}
//                   onChange={handleChange}
//                   isClearable
//                   placeholderText="Please choose Date!"
//                 />
//               </div>
//               <div className="row">
//                 <div className="title image-title">Analysis Image</div>
//                 <div className="image-container">
//                   <input
//                     className="upload-container"
//                     type="file"
//                     name="file"
//                     onChange={handleChangeFile}
//                   />
//                   {/* <div className="upload-container">
//                       <div className="upload-desc">Choose a file or drag it here</div>
//                   </div> */}
//                   <div className="registered-container">
//                     {formFiles.length > 0 &&
//                       formFiles.map((item, index) => (
//                         <div className="registered-image" key={index}>
//                           <span>{item.name}</span>
//                           <div
//                             className="delete-button"
//                             onClick={() => handleDeleteFile(index)}
//                           >
//                             <IoIosClose size={25} />
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="row last">
//                 <span className="text-button" onClick={handleStore}>
//                   Store On Blockchain
//                   <span style={{ fontWeight: '700' }}>&nbsp;Now</span>
//                 </span>
//                 <button className="primary-button grid-button last">
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default inject(
//   'diamondStore',
//   'snackbarStore',
// )(withRouter(observer(NewDiamond)));
