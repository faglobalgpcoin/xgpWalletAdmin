import axios from 'axios';
import { API_URL } from '../constants/api';

const getAllRoughStone = async () => {
  try {
    const response = await axios.get(API_URL + '/stone/rough');
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const registerRoughStone = async (stoneData) => {
  try {
    const response = await axios.post(API_URL + '/stone/rough', stoneData);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export { getAllRoughStone, registerRoughStone };
