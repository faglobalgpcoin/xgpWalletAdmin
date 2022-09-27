import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { AiOutlineKey } from 'react-icons/ai';
import useForm from 'react-hook-form';
import { withRouter } from 'react-router';

import { adminLogin, checkUserRole } from '../apis/auth';
import APP_PROPERTY from "../constants/appProperty";

function Login({ history }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (formdata, e) => {
    const response = await adminLogin(formdata);

    if (!response) {
      alert('Please check your account again');
      return;
    }

    if (response.status === "fail") {
      alert('Please check your account again');
      return;
    }

    if (!response.data) {
      alert("API Error"); // 번역필요
      return;
    }

    const userResponse = await checkUserRole(response.data.accessToken);

    if (!userResponse || userResponse.status === "fail") {
      alert('Please check expiration of your account'); // 번역필요
      return;
    }

    if (!userResponse.data.active) {
      alert('Please check expiration of your account'); // 번역필요
      return;
    }

    document.cookie =
      'key=' +
      btoa(
        JSON.stringify({
          isLoggedIn: true,
          userId: formdata.userId,
          username: userResponse.data.name || 'Admin',
          accessToken: response.data.accessToken,
        }),
      );
    history.push('/');
  };

  return (
    <div className="login">
      <div className="bg-wrapper">
        <div className="bg-title">
          <img src={require('../imgs/intro_moon.png')} alt="icon" />
          <hr />
          <p className="bg-desc">{APP_PROPERTY.TOKEN_NAME} Admin</p>
        </div>
        <div className="bg-footer">
          <p>{APP_PROPERTY.CS_EMAIL}</p>
        </div>
      </div>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login-content">
            <span className="welcome">
              Welcome to <b>{APP_PROPERTY.MAIN_TOKEN_SYMBOL} Wallet Admin Website</b>
            </span>
            <p className="please">
              Please enter your ID and <br /> password to login
            </p>
            <div>
              <AiOutlineUser className="input-icon" size={28} />
              <input
                className="input-text"
                name="userId"
                type="text"
                ref={register}
              />
            </div>
            <div>
              <AiOutlineKey className="input-icon" size={28} />
              <input
                className="input-text"
                name="password"
                type="password"
                ref={register}
              />
            </div>
            <button className="primary-button">
              <span>LOGIN</span>
              <FiArrowRight size={25} style={{ marginLeft: '15px' }} />
            </button>
          </div>
          {/*<div className="login-footer">*/}
          {/*  <p>Forgot your account?</p>*/}
          {/*</div>*/}
        </form>
      </div>
    </div>
  );
}

export default withRouter(Login);
