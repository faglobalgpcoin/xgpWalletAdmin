import axios from "axios";

import { API_URL, SCAN_TRANSFER_URL, GET_TOKEN_LIST } from "../constants/api";
import { axiosConfig }                from "../utils/api";

const getBalanceByAddress = async (accessToken, token, type, address) => {
  try {
    const response = await axios.get(
      API_URL + "/wallet/getbalance/" + type + "/" + token + "/" + address,
      axiosConfig(accessToken)
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getTokenInfos = async () => {
  try {
    const response = await axios.get(GET_TOKEN_LIST());
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export {
  getBalanceByAddress,
  getTokenInfos
};
