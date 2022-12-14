import axios from 'axios';

import { API_URL } from '../constants/api';
import { axiosConfig } from '../utils/api';

const getAppProperties = async (accessToken, postData) => {
    try {
        const response = await axios.get(
            API_URL + '/support/appProperties',
            axiosConfig(accessToken),
        );
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

const getAppPropertyByKeyName = async (accessToken, keyName) => {
    try {
        const response = await axios.get(
            API_URL + '/support/appProperty?keyName=' + keyName,
            axiosConfig(accessToken),
        );
        return response.data;
    } catch (e) {
        console.log(e);
    }
};



export { getAppProperties, getAppPropertyByKeyName };
