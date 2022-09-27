import * as moment from 'moment';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { orderBy } from '@progress/kendo-data-query';
import { filterBy } from '@progress/kendo-data-query';
import { GoSearch } from 'react-icons/go';
import { getDiamondBySerialNum } from '../../apis/diamond';
import { GiStoneBlock } from 'react-icons/gi';
import { DiRubyRough } from 'react-icons/di';
import DiamondDetailModal from '../../components/DiamondDetailModal';
import DIAMOND_STATE from '../../constants/diamond';

const StoredDiamond = ({ history, diamondStore, snackbarStore }) => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('VIEW');
  const [modalData, setModlaData] = useState({});
  const [sort, setSort] = useState([{}]);
  const [filterValue, setFilterValue] = useState('');
  const [filter, setFilter] = useState({
    logic: 'and',
    filters: [{ field: 'serialNum', operator: 'contains', value: '' }],
  });

  const {
    roughStoredDiamond,
    facetedStoredDiamond,
    fetchStoredDiamond,
  } = diamondStore;

  useEffect(() => {
    async function fetchInitialData() {
      await fetchStoredDiamond();
    }
    fetchInitialData();
  }, [fetchStoredDiamond]);

  const gridData = useMemo(
    () => [...roughStoredDiamond, ...facetedStoredDiamond],
    [roughStoredDiamond, facetedStoredDiamond],
  );

  const getDiamondDetail = async (serialNum) => {
    return await getDiamondBySerialNum(serialNum);
  };

  const handleOpenModal = async (serialNum, mode = 'VIEW') => {
    const diamondData = await getDiamondDetail(serialNum);

    if (diamondData) {
      setModalMode(mode);
      setIsModalOpen(true);
      setModlaData(diamondData);
    }
  };

  const handleChangeFilterValue = (e) => {
    setFilterValue(e.target.value);
  };

  const handleClickSearch = () => {
    const prevFilter = filter;
    prevFilter.filters[0].value = filterValue;
    setFilter(prevFilter);

    fetchStoredDiamond();
  };

  const handlePressKey = (e) => {
    if (e.key === 'Enter') {
      handleClickSearch();
    }
  };

  return (
    <div className="content list-block">
      <div className="content-title title-row">
        <span>Stored Diamond List</span>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            type="text"
            className="search-form"
            placeholder="Search for Serial Number ..."
            value={filterValue}
            onChange={handleChangeFilterValue}
            onKeyPress={handlePressKey}
          />
          <button
            type="button"
            className="search-button"
            onClick={handleClickSearch}
            style={{ top: '13px' }}
          >
            <GoSearch size={18} style={{ marginRight: 10 }} />
          </button>
        </div>
      </div>

      <Grid
        style={{ height: '90%', width: '100%' }}
        data={filterBy(orderBy(gridData, sort), filter)}
        onSortChange={(e) => setSort(e.sort)}
        sort={sort}
        resizable
        sortable
      >
        <Column
          field="serialNum"
          title="Serial Number"
          width="180px"
          locked
          cell={(props) => (
            <td className="k-grid-content-sticky locked-left">
              <span
                className="product-serial"
                onClick={() => handleOpenModal(props.dataItem[props.field])}
              >
                {props.dataItem.processStatus === DIAMOND_STATE.ROUGH_STORED ? (
                  <GiStoneBlock
                    size={15}
                    style={{ marginBottom: '-3px', marginRight: '5px' }}
                  />
                ) : (
                  <DiRubyRough
                    size={15}
                    style={{ marginBottom: '-3px', marginRight: '5px' }}
                  />
                )}
                {props.dataItem[props.field]}
              </span>
            </td>
          )}
        />
        <Column
          field="roughCreated"
          title="Date"
          width="210px"
          cell={(props) => (
            <td>
              <span>
                {moment(props.dataItem[props.field] || '').format('LL')}
              </span>
            </td>
          )}
        />
        <Column field="roughMeasurements" title="Measurements" width="180px" />
        <Column field="roughCaratWeight" title="Carat Weight" width="180px" />
        <Column field="roughColor" title="Color" width="140px" />
        <Column
          field="roughExpectedClarity"
          title="Expected Clarity"
          width="180px"
        />
        <Column
          field="roughExpectedCarat"
          title="Expected Carat"
          width="180px"
        />
      </Grid>
      <DiamondDetailModal
        mode={modalMode}
        data={modalData}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        // refreshFunction={fetchRoughDiamond}
      />
    </div>
  );
};

export default inject(
  'diamondStore',
  'snackbarStore',
)(withRouter(observer(StoredDiamond)));
