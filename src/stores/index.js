import { create } from 'mobx-persist';
import AuthStore from './auth';
// import ProductStore from './product';
// import DiamondStore from './diamond';
import SnackbarStore from './snackbar';
import NoticeStores from './notice';

const authStore = new AuthStore();
// const productStore = new ProductStore();
// const diamondStore = new DiamondStore();
const snackbarStore = new SnackbarStore();

const hydrate = create({});
// hydrate('productStore', productStore, () => console.log('product hydrated'));

export default {
    authStore,
    // productStore,
    // diamondStore,
    snackbarStore,
    ...NoticeStores,
};
