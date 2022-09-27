// import React, { useState } from 'react';
// import useForm from 'react-hook-form';
// import DatePicker from 'react-datepicker';
// import { withRouter } from 'react-router-dom';
// import { registerRoughStone } from '../../apis/stone';
// import { roughStoneGenerate } from '../../utils/generator';
// import { IoIosClose } from 'react-icons/io';
// import { uploadToS3 } from '../../utils/file';
// import 'react-datepicker/dist/react-datepicker.css';

// function Register({ match, history }) {
//   const [date, setDate] = useState(new Date());
//   const [date2, setDate2] = useState(new Date());
//   const [formFiles, setFormFiles] = useState([]);

//   const { register, handleSubmit } = useForm();

//   const handleChange = (date) => {
//     setDate(date);
//   };

//   const handleChange2 = (date) => {
//     setDate2(date);
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

//   const onSubmit = async (data) => {
//     // // form 유효성 검사 완료하고, 이미지 업로드
//     // const uploadedUrlArr = await uploadRegisteredFiles();

//     // // 이미지 업로드 후 DB 등록
//     // const result = await registerRoughStone({
//     //   ...data,
//     //   stoneId: 2,
//     //   images: uploadedUrlArr,
//     // });

//     console.log(roughStoneGenerate());

//     const result = await registerRoughStone(roughStoneGenerate());

//     if (result) {
//       alert('등록 성공');
//     }
//   };

//   return (
//     <div className="scroll-content">
//       <div className="padding-container">
//         <div className="content-title">Register Product</div>

//         <div className="add-diamond-container">
//           {match.path === '/add-product' && (
//             <>
//               <div className="block-title">Rough Stone Registration</div>
//               <div className="half-block">
//                 <form className="form" onSubmit={handleSubmit(onSubmit)}>
//                   <div className="row">
//                     <div className="title">IRGL Serial Number</div>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="serialNum"
//                       ref={register}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="title">Measurements</div>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="measurements"
//                       ref={register}
//                     />
//                     <span className="unit">mm</span>
//                   </div>
//                   <div className="row">
//                     <div className="title">Carat Weight</div>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="caratWeight"
//                       ref={register}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="title">Color</div>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="color"
//                       ref={register}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="title">Expected Clarity</div>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="expectedClarity"
//                       ref={register}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="title image-title">Expected Carat</div>
//                     {/* <div
//                   style={{
//                     flexDirection: 'column',
//                     width: '100%',
//                   }}
//                 > */}
//                     {/* <div style={{ marginBottom: '25px' }}>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="expectedCarat"
//                       ref={register}
//                     />
//                   </div>
//                   <div style={{ marginBottom: '25px' }}>
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="expectedCarat"
//                       ref={register}
//                     />
//                   </div> */}
//                     {/* <div> */}
//                     <input
//                       type="text"
//                       className="register-input"
//                       name="expectedCarat"
//                       ref={register}
//                     />
//                     <span className="unit">carat</span>
//                     {/* </div> */}
//                     {/* </div> */}
//                   </div>
//                   <div className="row">
//                     <div className="title">Date</div>
//                     <DatePicker
//                       className="register-input"
//                       selected={date}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="title image-title">Analysis Image</div>
//                     <div className="image-container">
//                       <input
//                         className="upload-container"
//                         type="file"
//                         name="file"
//                         onChange={handleChangeFile}
//                       />
//                       {/* <div className="upload-container">
//                                         <div className="upload-desc">Choose a file or drag it here</div>
//                                     </div> */}
//                       <div className="registered-container">
//                         {formFiles.length > 0 &&
//                           formFiles.map((item, index) => (
//                             <div className="registered-image" key={index}>
//                               <span>{item.name}</span>
//                               <div
//                                 className="delete-button"
//                                 onClick={() => handleDeleteFile(index)}
//                               >
//                                 <IoIosClose size={25} />
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row last">
//                     <button className="primary-button" style={{ width: 170 }}>
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </>
//           )}
//           {match.path === '/add-product/:stoneId' && (
//             <>
//               <div className="block-title">Faceted Gemstone Registration</div>
//               <div className="half-block">
//                 <div>Rough Stone Information</div>
//                 <div className="form">
//                   <div className="row">
//                     <div className="title">가공 의뢰처 정보 : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">커트 사양(128면 cut) : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">Carat Weight : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">Color : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">Expected Clarity : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">Expected Carat : </div>
//                     <input className="register-input" type="text" />
//                   </div>
//                   <div className="row">
//                     <div className="title">Date : </div>
//                     <DatePicker
//                       className="register-input"
//                       selected={date2}
//                       onChange={handleChange2}
//                     />
//                   </div>
//                   <div className="row last">
//                     <button className="primary-button" style={{ width: 170 }}>
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default withRouter(Register);
