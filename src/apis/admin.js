import axios from "axios";
import {API_URL} from "../constants/api";
import {axiosConfig} from "../utils/api";

const getAdminUsers = async (accessToken) => {
  try {
    const response = await axios.get(
      API_URL + "/admin/adminList",
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const registerAdminUser = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/registerAdminUser",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const modifyAdminUser = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/modifyAdminUser",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const deleteAdminUser = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/deleteAdminUser",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const registerAppProperty = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + '/admin/registerAppProperty',
      postData,
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const updateAppProperty = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + '/admin/updateAppProperty',
      postData,
      axiosConfig(accessToken),
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getAllUser = async (accessToken) => {
  try {
    const response = await axios.get(
      API_URL + "/admin/userAll",
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const getUsersByparams = async (accessToken, params) => {
  try {
    const response = await axios.get(
      API_URL + `/admin/userList?page=${params.page}&size=${params.size}&order=${params.order}&direction=${params.direction}&search=${params.search}` + (params.isLockUp ? `&lockUp=${params.isLockUp}` : ""),
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const updateUserLockUp = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/lockUp",
      postData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const modifyUser = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/modifyUser",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const getAdminAllowIps = async (accessToken) => {
  try {
    const response = await axios.get(
      API_URL + "/admin/adminAllowIps",
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const deleteAdminIp = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/deleteAdminIp",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const registerAdminIp = async (accessToken, formData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/registerAdminIp",
      formData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
}

const airdropToUser = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/airdrop",
      postData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const airdropToAdmin = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/airdropBack",
      postData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const airdropToUserWithId = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/airdropWithId",
      postData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const airdropToAdminWithId = async (accessToken, postData) => {
  try {
    const response = await axios.post(
      API_URL + "/admin/airdropBackWithId",
      postData,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const getAllTransactions = async (accessToken) => {
  try {
    const response = await axios.get(
      API_URL + "/admin/transactionsAll",
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const getTransactionsByparams = async (accessToken, params) => {
  try {
    const response = await axios.get(
      API_URL + `/admin/transactionList?page=${params.page}&size=${params.size}&order=${params.order}&direction=${params.direction}&search=${params.search}&startDate=${params.startDate}&endDate=${params.endDate}`,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const getAllCouponPurchaseHistory = async (accessToken) => {
  try {
    const response = await axios.get(
      API_URL + "/admin/couponPurchaseHistoryAll",
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

const getCouponPurchaseHistory = async (accessToken, params) => {
  try {
    const response = await axios.get(
      API_URL + `/admin/couponPurchaseHistory?page=${params.page}&size=${params.size}&order=${params.order}&direction=${params.direction}&search=${params.search}`,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch ( e ) {
    console.log(e);
  }
};

export {
  getAdminUsers,
  registerAdminUser,
  modifyAdminUser,
  deleteAdminUser,
  registerAppProperty,
  updateAppProperty,
  getAllUser,
  getUsersByparams,
  updateUserLockUp,
  modifyUser,
  getAdminAllowIps,
  deleteAdminIp,
  registerAdminIp,
  airdropToUser,
  airdropToAdmin,
  airdropToUserWithId,
  airdropToAdminWithId,
  getAllTransactions,
  getTransactionsByparams,
  getAllCouponPurchaseHistory,
  getCouponPurchaseHistory
};
