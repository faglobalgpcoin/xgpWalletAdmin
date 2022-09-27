import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import useForm from 'react-hook-form';
import {FiArrowLeft} from 'react-icons/fi';
import {decodeCookieData, getCookie, resetCookie} from '../utils/auth';
import {
  getAppProperties
} from '../apis/appProperty';
import {checkUserRole} from "../apis/auth";
import {registerAppProperty, updateAppProperty} from "../apis/admin";

const NewAppProperty = ({location, match, history}) => {
  const {register, handleSubmit, errors, setValue} = useForm();

  const onSubmit = async (data) => {
    let response;
    const {accessToken} = decodeCookieData(getCookie('key'));
    console.log(accessToken);

    if (location.pathname === '/new-property') {
      response = await registerAppProperty(accessToken, data);
    } else {
      response = await updateAppProperty(accessToken, data);
    }

    if (!response) alert('Save failed');

    if (response.status === "fail") alert('Save failed');

    if (response.data) {
      alert('Saved successfully!');
      history.goBack();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const cookieData = decodeCookieData(getCookie('key'));
      const userResponse = await checkUserRole(cookieData.accessToken);

      if (!userResponse.data.active) {
        resetCookie();
        history.push("/");
      }

      if (!userResponse.data.permissions.properties) {
        alert('Please check your account again');
        history.push('/');
        return;
      }

      const response = await getAppProperties(cookieData.accessToken);

      if (!response) {
        return;
      }

      if (response) {
        response.data.forEach((i) => {
          if (i.id === match.params.id) {
            setValue('keyName', i.keyName);
            setValue('value', i.value);
          }
        });
      }
    }

    fetchData();
  }, [match.params.id, setValue]);

  return (
    <div className="content">
      <div className="content-title">
        <button
          className="back-button"
          style={{marginBottom: -5}}
          onClick={() => history.goBack()}>
          <FiArrowLeft size={28} />
        </button>
        <span>
          {location.pathname === '/new-property'
            ? 'New Property'
            : 'Modify Property'}
        </span>
      </div>
      <div
        className="half-block add-container"
        style={{minHeight: 300, paddingTop: 35}}>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {location.pathname !== '/new-property' && (
            <div className="row" style={{marginBottom: 55}}>
              <div className="title" />
              <div className="caution-wrapper">
                <div>
                  <span role="img" aria-label="caution">
                    ⚠️
                  </span>
                  Please Be careful when changing the name or value of an App
                  Property. This may affect the Wallet.
                </div>
              </div>
            </div>
          )}
          <div className="row" style={{height: 50}}>
            <div className="title">Key Name</div>
            <div className="register-input-wrapper">
              <input
                type="text"
                className={
                  'register-input ' +
                  (errors.keyName && errors.keyName.type === 'required'
                    ? 'error-input'
                    : '')
                }
                name="keyName"
                ref={register({
                  required: true,
                })}
              />
              {errors.keyName && errors.keyName.type === 'required' && (
                <div className="error">Key Name is required</div>
              )}
            </div>
          </div>
          <div className="row" style={{height: 50}}>
            <div className="title">Value</div>
            <div className="register-input-wrapper">
              <input
                type="text"
                className={
                  'register-input ' +
                  (errors.value && errors.value.type === 'required'
                    ? 'error-input'
                    : '')
                }
                name="value"
                ref={register({
                  required: true,
                })}
              />
              {errors.value && errors.value.type === 'required' && (
                <div className="error">Value is required</div>
              )}
            </div>
          </div>
          <div className="row" style={{marginTop: 15}}>
            <button className="primary-button" style={{width: 170}}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(NewAppProperty);
