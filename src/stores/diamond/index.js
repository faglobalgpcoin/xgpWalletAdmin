// import { observable, action } from 'mobx';
// import {
//   getAllRoughDiamond,
//   getAllRoughStoredDiamond,
//   getAllFacetedDiamond,
// } from '../../apis/diamond';
// import { getStoredDiamond } from '../../utils/caverService';

// export default class DiamondStore {
//   @observable roughDiamond = [];
//   @observable roughStoredDiamond = [];
//   @observable roughStoredDiamondFromDB = [];
//   @observable facetedDiamond = [];
//   @observable facetedStoredDiamond = [];

//   @observable number = 0;

//   @action fetchStoredDiamond = async () => {
//     const result = await getStoredDiamond();

//     this.roughStoredDiamond = result.roughData;
//     this.facetedStoredDiamond = result.facetedData;
//   };

//   @action fetchRoughDiamond = async () => {
//     const data = await getAllRoughDiamond();

//     if (data) {
//       this.roughDiamond = data;
//       return data;
//     }
//   };

//   @action fetchRoughStoredDiamond = async () => {
//     const data = await getAllRoughStoredDiamond();

//     if (data) {
//       this.roughStoredDiamondFromDB = data;
//       return data;
//     }
//   };

//   @action fetchFacetedDiamond = async () => {
//     const data = await getAllFacetedDiamond();

//     if (data) {
//       this.facetedDiamond = data;
//       return data;
//     }
//   };

//   @action increase = () => {
//     this.number++;
//   };

//   @action decrease = () => {
//     this.number--;
//   };
// }
