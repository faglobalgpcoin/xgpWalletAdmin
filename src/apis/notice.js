import axios from 'axios';

import { API_URL } from '../constants/api';
import { axiosConfig } from '../utils/api';

export function getNoticeList(access_token) {
    return axios.get(`${API_URL}/support/notices`,
        axiosConfig(access_token)
    );
}

export function postPostByApi(access_token, bodyParams) {
    return axios.post(`${API_URL}/admin/registernotice`,
        bodyParams,
        axiosConfig(access_token)
    );
}

export function patchPostByApi(access_token, bodyParams) {
    return axios.patch(`${API_URL}/admin/updatenotice`,
        bodyParams,
        axiosConfig(access_token)
    );
}
