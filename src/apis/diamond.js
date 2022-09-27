import axios from 'axios';

import { API_URL } from '../constants/api';
import DIAMOND_STATE from '../constants/diamond';

const getAllRoughDiamond = async () => {
  try {
    const response = await axios.get(API_URL + '/diamond/rough');
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getAllRoughStoredDiamond = async () => {
  try {
    const response = await axios.get(API_URL + '/diamond/rough-stored');
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getAllFacetedDiamond = async () => {
  try {
    const response = await axios.get(API_URL + '/diamond/faceted');
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getAllFacetedStoredDiamond = async () => {
  try {
    const response = await axios.get(API_URL + '/diamond/faceted-stored');
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const getDiamondBySerialNum = async (serialNum) => {
  try {
    const response = await axios.get(API_URL + '/diamond/' + serialNum);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const registerRoughDiamond = async (roughData) => {
  try {
    const response = await axios.post(API_URL + '/diamond', {
      ...roughData,
      processStatus: roughData.processStatus || DIAMOND_STATE.ROUGH_DRAFT,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const updateDiamond = async (data) => {
  try {
    const response = await axios.put(
      API_URL + '/diamond/' + data.serialNum,
      data,
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const deleteDiamond = async (data) => {
  try {
    const response = await axios.put(API_URL + '/diamond/' + data.serialNum, {
      ...data,
      isDeleted: true,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export {
  getAllRoughDiamond,
  getAllRoughStoredDiamond,
  getAllFacetedDiamond,
  getAllFacetedStoredDiamond,
  getDiamondBySerialNum,
  registerRoughDiamond,
  updateDiamond,
  deleteDiamond,
};
