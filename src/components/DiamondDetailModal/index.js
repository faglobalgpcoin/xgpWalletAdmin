import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import useForm from 'react-hook-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { updateDiamond, deleteDiamond } from '../../apis/diamond';
import { uploadToS3 } from '../../utils/file';
import { IoIosClose } from 'react-icons/io';
import { AiOutlineCopy } from 'react-icons/ai';
import { IoIosTrash } from 'react-icons/io';
import { MdCreate } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
import { GoCheck } from 'react-icons/go';
import { FiArrowRight } from 'react-icons/fi';
import { inject, observer } from 'mobx-react';
import DIAMOND_STATE from '../../constants/diamond';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 220,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(130, 130, 130, 0.15)',
    zIndex: 60,
  },
  content: {
    top: '47%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 30,
  },
};

const stringsByState = {
  rough: {
    state: 'rough',
    title: 'Rough Diamond Detail',
  },
  faceted: {
    state: 'faceted',
    title: 'Faceted Diamond Detail',
  },
};

Modal.setAppElement('#root');

const DiamondDetailModal = ({
  isOpen,
  setIsOpen,
  data,
  mode,
  refreshFunction,
  snackbarStore,
}) => {
  const [isEditMode, setIsEditMode] = useState('VIEW');
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('');
  const [formFiles, setFormFiles] = useState([]);
  const [strings, setStrings] = useState({ state: 'faceted' });

  const { register, unregister, handleSubmit } = useForm();
  const { activeSnackbar } = snackbarStore;

  useEffect(() => {
    if (
      data.processStatus === DIAMOND_STATE.ROUGH_DRAFT ||
      data.processStatus === DIAMOND_STATE.ROUGH_STORED
    ) {
      setStrings(stringsByState.rough);
    } else {
      setStrings(stringsByState.faceted);
    }
    setIsEditMode(mode !== 'VIEW');

    return () => {
      setFormFiles([]);
      setIsConfirmMode(false);
      unregister();
    };
  }, [isOpen, setIsOpen, data, mode, unregister, handleSubmit, register]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChangeFile = (e) => {
    const currentFile = e.target.files[0];
    setFormFiles((prev) => [...prev, currentFile]);
  };

  const handleDeleteFile = (index) => {
    const prevFiles = formFiles;
    prevFiles.splice(index, 1);
    setFormFiles([...prevFiles]);
  };

  const handlePopImage = (index) => {
    data.roughAnalysisImages.splice(index, 1);
  };

  const uploadRegisteredFiles = async () => {
    let tempArr = [];

    for (let i = 0; i < formFiles.length; i++) {
      const response = await uploadToS3(formFiles[i]);
      tempArr.push(response.url);
    }

    return tempArr;
  };

  const toggleChangeMode = (e) => {
    setIsEditMode(!isEditMode);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  const onConfirmDelete = () => {
    setIsConfirmMode(true);
  };

  const handleDeleteDiamond = async () => {
    const result = await deleteDiamond(data);

    if (result) {
      activeSnackbar(`Rough Diamond(${data.serialNum}) deleted 🗑`);
      refreshFunction();
      closeModal();
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onSubmit = async (formdata, e) => {
    let uploadedUrlArr = [];
    console.log({ ...formdata, ...data });

    // form 유효성 검사 완료하고, 이미지 업로드
    if (strings.state === 'rough') {
      uploadedUrlArr = await uploadRegisteredFiles();
    }

    // 이미지 링크와 함께 DB에 등록
    const result = await updateDiamond({
      ...data,
      ...formdata,
      roughAnalysisImages: [...data.roughAnalysisImages, ...uploadedUrlArr],
    });

    if (result) {
      activeSnackbar(
        `Save edited Rough Diamond(${data.serialNum}) Information 😀!`,
      );
      refreshFunction();
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      closeTimeoutMS={300}
      style={customStyles}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
    >
      <div className="frame">
        <div className="scroll">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <div className="header-button">
                <span className="title">{strings.title}</span>
                <span>{`(${data.serialNum})`}</span>
              </div>
              <div className="header-button">
                {(data.processStatus === DIAMOND_STATE.ROUGH_DRAFT ||
                  data.processStatus === DIAMOND_STATE.FACETED_DRAFT) &&
                  (isEditMode ? (
                    <>
                      <button
                        type="button"
                        className="simple-button"
                        onClick={toggleChangeMode}
                      >
                        <MdClose size={20} style={{ marginRight: 15 }} />
                        Cancel
                      </button>
                      <button type="submit" className="black-button">
                        <GoCheck size={20} style={{ marginRight: 15 }} />
                        Save
                      </button>
                    </>
                  ) : isConfirmMode ? (
                    <>
                      <button
                        type="button"
                        className="simple-button"
                        onClick={() => setIsConfirmMode(false)}
                      >
                        <MdClose size={20} style={{ marginRight: 15 }} />
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="warning-button"
                        onClick={handleDeleteDiamond}
                      >
                        <GoCheck size={20} style={{ marginRight: 15 }} />
                        Delete!
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="simple-button"
                        onClick={toggleChangeMode}
                      >
                        <MdCreate size={20} style={{ marginRight: 15 }} />
                        Edit
                      </button>
                      {data.processStatus === DIAMOND_STATE.ROUGH_DRAFT && (
                        <button
                          type="button"
                          className="simple-button"
                          onClick={onConfirmDelete}
                        >
                          <IoIosTrash size={20} style={{ marginRight: 15 }} />
                          Delete
                        </button>
                      )}
                    </>
                  ))}
                <button type="button" onClick={closeModal}>
                  <IoIosClose size={30} />
                </button>
              </div>
            </div>
            <div className="modal-content">
              <div className="half-block">
                <div className="title-wrapper">IRGL Records</div>
                <div className="form-wrapper">
                  {strings.state === 'rough' && (
                    <div>{moment(data.roughCreated).format('LL')}</div>
                  )}
                  {data.tokenId && (
                    <div className="input-wrapper first">
                      <span>ERC721 Token Id</span>
                      <span className="view-value">
                        {data.tokenId}
                        {copied ? (
                          <button type="button">
                            <GoCheck
                              size={16}
                              style={{ color: '#6f94b5', marginBottom: '-4px' }}
                            />
                          </button>
                        ) : (
                          <CopyToClipboard text={data.address}>
                            <button type="button" onClick={handleCopy}>
                              <AiOutlineCopy
                                size={16}
                                style={{ color: 'gray', marginBottom: '-4px' }}
                              />
                            </button>
                          </CopyToClipboard>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="input-wrapper">
                    <span>Serial Number</span>
                    <span className="view-value">{data.serialNum}</span>
                  </div>
                  <div className="input-wrapper last">
                    <span>Measurements</span>
                    {isEditMode && strings.state === 'rough' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="roughMeasurements"
                        defaultValue={data.roughMeasurements}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.roughMeasurements}
                      </span>
                    )}
                  </div>
                </div>
                <div className="title-wrapper">Result</div>
                <div className="form-wrapper">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '7px',
                    }}
                  >
                    <span className="state-title">Rough Information</span>
                    {strings.state === 'faceted' && (
                      <div>{moment(data.roughCreated).format('LL')}</div>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Carat Weight</span>
                    {isEditMode && strings.state === 'rough' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="roughCaratWeight"
                        defaultValue={data.roughCaratWeight}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.roughCaratWeight}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Color</span>
                    {isEditMode && strings.state === 'rough' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="roughColor"
                        defaultValue={data.roughColor}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">{data.roughColor}</span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Expected Clarity</span>
                    {isEditMode && strings.state === 'rough' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="roughExpectedClarity"
                        defaultValue={data.roughExpectedClarity}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.roughExpectedClarity}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper last">
                    <span>Expected Carat</span>
                    {isEditMode && strings.state === 'rough' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="roughExpectedCarat"
                        defaultValue={data.roughExpectedCarat}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.roughExpectedCarat}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {strings.state === 'faceted' && (
                <div className="form-wrapper" style={{ paddingTop: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '7px',
                    }}
                  >
                    <span className="state-title">Facet Information</span>
                    {moment(data.facetedCreated).format('LL')}
                  </div>
                  <div className="input-wrapper">
                    <span>Client</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedClient"
                        defaultValue={data.facetedClient}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">{data.facetedClient}</span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Cutting Shapes</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedCuttingShape"
                        defaultValue={data.facetedCuttingShape}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.facetedCuttingShape}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper first">
                    <span>Carat Weight</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedCaratWeight"
                        defaultValue={data.facetedCaratWeight}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.facetedCaratWeight}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Color</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedColor"
                        defaultValue={data.facetedColor}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">{data.facetedColor}</span>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <span>Expected Clarity</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedExpectedClarity"
                        defaultValue={data.facetedExpectedClarity}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.facetedExpectedClarity}
                      </span>
                    )}
                  </div>
                  <div className="input-wrapper last">
                    <span>Expected Carat</span>
                    {isEditMode && strings.state === 'faceted' ? (
                      <input
                        className="edit-input"
                        type="text"
                        name="facetedExpectedCarat"
                        defaultValue={data.facetedExpectedCarat}
                        ref={register}
                      />
                    ) : (
                      <span className="view-value">
                        {data.facetedExpectedCarat}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="half-block">
                <div className="title-wrapper">Analysis Images</div>
                <div className="form-wrapper">
                  {isEditMode && strings.state === 'rough' && (
                    <div className="image-container">
                      <input
                        className="upload-container"
                        type="file"
                        name="file"
                        onChange={handleChangeFile}
                      />
                      <div className="registered-container">
                        {formFiles.length > 0 &&
                          formFiles.map((item, index) => (
                            <div className="registered-image" key={index}>
                              <span>{item.name}</span>
                              <div
                                className="delete-button"
                                onClick={() => handleDeleteFile(index)}
                              >
                                <IoIosClose size={25} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {data.roughAnalysisImages &&
                    data.roughAnalysisImages.map((value, index) => {
                      return (
                        <figure
                          key={index}
                          onMouseMove={handleMouseMove}
                          style={{
                            backgroundImage: `url(${value})`,
                            backgroundPosition,
                          }}
                        >
                          {isEditMode && strings.state === 'rough' && (
                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handlePopImage(index)}
                            >
                              <MdClose size={30} />
                            </button>
                          )}
                          <img
                            className="image"
                            src={value}
                            alt={`RoughStoneAnalysis${index}`}
                          />
                        </figure>
                      );
                    })}
                </div>
              </div>
              {data.facetedStoredTxHash ? (
                <div className="hyperlink-wrapper">
                  <span
                    className="hyperlink-text"
                    onClick={() =>
                      window.open(
                        'https://baobab.scope.klaytn.com/tx/' +
                          data.facetedStoredTxHash,
                        '_blank',
                      )
                    }
                  >
                    Go to KlaytnScope and &nbsp;
                    <b style={{ color: '#4e4376' }}>
                      {' '}
                      Search for this FacetedDiamond Token
                    </b>
                    <FiArrowRight size={20} style={{ marginLeft: '10px' }} />
                  </span>
                </div>
              ) : (
                data.roughStoredTxHash && (
                  <div className="hyperlink-wrapper">
                    <span
                      className="hyperlink-text"
                      onClick={() =>
                        window.open(
                          'https://baobab.scope.klaytn.com/tx/' +
                            data.roughStoredTxHash,
                          '_blank',
                        )
                      }
                    >
                      Go to KlaytnScope and &nbsp;
                      <b style={{ color: '#4e4376' }}>
                        {' '}
                        Search for this RoughDiamond Token
                      </b>
                      <FiArrowRight size={20} style={{ marginLeft: '10px' }} />
                    </span>
                  </div>
                )
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default inject('snackbarStore')(observer(DiamondDetailModal));
