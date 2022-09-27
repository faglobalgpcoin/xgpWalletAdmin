import * as moment from 'moment';
import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { inject, observer } from 'mobx-react';
import 'react-datepicker/dist/react-datepicker.css';
import { updateDiamond } from '../../apis/diamond';
import DIAMOND_STATE from '../../constants/diamond';
import { addMetadataOnBlockchain } from '../../utils/caverService';

function UpdateFacetedDiamond({ match, history, diamondStore, snackbarStore }) {
  // 배열에 -s 붙여라
  const [date, setDate] = useState(new Date());
  const [roughStored, setRoughStored] = useState({});
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');

  const { register, handleSubmit, getValues } = useForm();
  const { roughStoredDiamondFromDB } = diamondStore;

  useEffect(() => {
    const data = roughStoredDiamondFromDB.find(
      (item) => item.serialNum === match.params.serialNum,
    );
    setRoughStored(data);
  }, [match.params.serialNum, roughStoredDiamondFromDB]);

  const handleChangeDate = (date) => {
    setDate(date);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  const updateDatabaseDiamond = async (data) => {
    return await updateDiamond(data);
  };

  const handleClickStore = async () => {
    let txResult;
    let result;
    let newData;
    const formdata = getValues();

    newData = {
      ...roughStored,
      ...formdata,
      facetedCreated: moment(date).format('LL'),
      processStatus: DIAMOND_STATE.FACETED_STORED,
    };

    txResult = await addMetadataOnBlockchain(
      parseInt(roughStored.tokenId),
      newData,
    );
    newData.facetedStoredTxHash = txResult.transactionHash;

    result = await updateDatabaseDiamond(newData);

    if (result) {
      snackbarStore.activeSnackbar('Store Faceted Diamond on Blockhain 💎');
      diamondStore.fetchFacetedDiamond();
      history.goBack();
    }
  };

  const onSubmit = async (formdata) => {
    const result = await updateDatabaseDiamond({
      ...roughStored,
      ...formdata,
      facetedCreated: moment(date).format('LL'),
      processStatus: DIAMOND_STATE.FACETED_DRAFT,
    });

    if (result) {
      snackbarStore.activeSnackbar('Faceted Information saved successfully 😎');
      diamondStore.fetchFacetedDiamond();
      history.goBack();
    }
  };

  return (
    <div className="scroll-content">
      <div className="padding-container">
        <div className="content-title">
          <button className="back-button" onClick={() => history.goBack()}>
            <FiArrowLeft size={25} />
          </button>
          <span>Update Processing Information</span>
        </div>

        {roughStored && (
          <div className="faceted-diamond-container">
            <div className="half-block left">
              <div className="block-title">Rough Diamond Information</div>
              <div className="title-wrapper">IRGL Records</div>
              <div className="form-wrapper">
                <div>{moment(roughStored.roughCreated).format('LL')}</div>
                <div className="input-wrapper">
                  <span>ERC721 Token Id</span>
                  <span className="view-value address">
                    {roughStored.tokenId}
                  </span>
                </div>
                <div className="input-wrapper">
                  <span>Serial Number</span>
                  <span className="view-value">{roughStored.serialNum}</span>
                </div>
                <div className="input-wrapper last">
                  <span>Measurements</span>
                  <span className="view-value">
                    {roughStored.roughMeasurements}
                  </span>
                </div>
              </div>
              <div className="title-wrapper">Result</div>
              <div className="form-wrapper">
                <div className="input-wrapper first">
                  <span>Carat Weight</span>
                  <span className="view-value">
                    {roughStored.roughCaratWeight}
                  </span>
                </div>
                <div className="input-wrapper">
                  <span>Color</span>
                  <span className="view-value">{roughStored.roughColor}</span>
                </div>
                <div className="input-wrapper">
                  <span>Expected Clarity</span>
                  <span className="view-value">
                    {roughStored.roughExpectedClarity}
                  </span>
                </div>
                <div className="input-wrapper last">
                  <span>Expected Carat</span>
                  <span className="view-value">
                    {roughStored.roughExpectedCarat}
                  </span>
                </div>
              </div>
              <div className="title-wrapper">Analysis Images</div>
              <div className="form-wrapper">
                {roughStored.roughAnalysisImages &&
                  roughStored.roughAnalysisImages.map((value, index) => {
                    return (
                      <figure
                        key={index}
                        onMouseMove={handleMouseMove}
                        style={{
                          backgroundImage: `url(${value})`,
                          backgroundPosition,
                        }}
                      >
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

            <div className="half-block right">
              <div className="block-title">Enter Facet Information</div>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form">
                  <div className="row">
                    <div className="title">Client</div>
                    <input
                      className="register-input"
                      name="facetedClient"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Cutting Shape</div>
                    <input
                      className="register-input"
                      name="facetedCuttingShape"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Carat Weight</div>
                    <input
                      className="register-input"
                      name="facetedCaratWeight"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Color</div>
                    <input
                      className="register-input"
                      name="facetedColor"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Expected Clarity</div>
                    <input
                      className="register-input"
                      name="facetedExpectedClarity"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Expected Carat</div>
                    <input
                      className="register-input"
                      name="facetedExpectedCarat"
                      type="text"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="title">Date</div>
                    <DatePicker
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Please choose Date!"
                      className="register-input"
                      selected={date}
                      onChange={handleChangeDate}
                      isClearable
                    />
                  </div>
                  <div className="row last">
                    <span className="text-button" onClick={handleClickStore}>
                      Store On Blockchain
                      <span style={{ fontWeight: '700' }}>&nbsp;Now</span>
                    </span>
                    <button className="primary-button grid-button last">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default inject(
  'diamondStore',
  'snackbarStore',
)(withRouter(observer(UpdateFacetedDiamond)));
