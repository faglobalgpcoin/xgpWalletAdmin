const API_URL_PRODUCTION = "https://api.xgpinco.com/api/v1";
const CHAIN_CODE = '7806468005210300226';

const API_URL = API_URL_PRODUCTION;

const DMW_SCAN = "https://sidescan.luniverse.io/chains/7806468005210300226/dashboard";

const SCAN_TRANSFER_URL = (address) =>
	`https://api.luniverse.io/scan/v1.0/chains/${CHAIN_CODE}/accounts/${address}/tokens?limit=25`;

const SCAN_URL = DMW_SCAN;

const GET_TOKEN_LIST = () =>
  `${API_URL}/support/gettokeninfo`;

export { API_URL, SCAN_TRANSFER_URL, SCAN_URL, GET_TOKEN_LIST };
