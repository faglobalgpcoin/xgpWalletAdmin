import React, {useEffect, useState} from 'react';
import {getCookie, decodeCookieData} from '../utils/auth';
import {Grid, GridColumn as Column} from '@progress/kendo-react-grid';
import {orderBy} from '@progress/kendo-data-query';
import {filterBy} from '@progress/kendo-data-query';
import {getAllUser} from '../apis/admin';
import {GoSearch} from 'react-icons/go';
import {MdLockOutline} from 'react-icons/md';
import {MdCreate} from 'react-icons/md';
import {GoPrimitiveDot} from 'react-icons/go';
import {getAppPropertyByKeyName} from '../apis/appProperty';
import LockUpModal from '../components/LockUpModal';
import {timeConverter} from '../utils/string';

function UserMining({history}) {
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState([{}]);
  const [modalData, setModalData] = useState({});
  const [lockUpAll, setLockUpAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [filter, setFilter] = useState({
    logic: 'or',
    filters: [
      {field: 'email', operator: 'contains', value: ''},
      {field: 'name', operator: 'contains', value: ''},
      {field: 'phoneNumber', operator: 'contains', value: ''},
    ],
  });

  async function fetchData() {
    const {accessToken} = decodeCookieData(getCookie('key'));
    const userResponse = await getAllUser(accessToken);
    const propertyResponse = await getAppPropertyByKeyName(
      accessToken,
      'lock_up_all',
    );

    if (userResponse) {
      setUsers(userResponse);
    }

    if (propertyResponse && propertyResponse.value) {
      setLockUpAll(propertyResponse.value === 'true');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeFilterValue = (e) => {
    setFilterValue(e.target.value);
  };

  const handleClickSearch = async () => {
    const prevFilter = filter;
    prevFilter.filters[0].value = filterValue;
    prevFilter.filters[1].value = filterValue;
    prevFilter.filters[2].value = filterValue;
    setFilter(prevFilter);
    fetchData();
  };

  const handlePressKey = (e) => {
    if (e.key === 'Enter') {
      handleClickSearch();
    }
  };

  const handlePressCategory = (value) => {
    setCatFilter(value);
  };

  const categoryFilter = (element) => {
    if (catFilter === 'lockup') {
      return element.lockUp === true;
    } else if (catFilter === 'none') {
      return element.lockUp === false;
    }
    return element;
  };

  const handleClickModalOpen = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="content user-container">
      <div
        className="content-title title-row"
        style={{height: 48, marginBottom: 10, justifyContent: 'flex-start'}}>
        <span>User Mining</span>
      </div>
      <div className="content-buttons">
        <div className="filter-wrapper">
          <div
            className={`filter-button ${catFilter === 'all' && 'active'}`}
            onClick={() => handlePressCategory('all')}>
            All
          </div>
          <div
            className={`filter-button ${catFilter === 'lockup' && 'active'}`}
            onClick={() => handlePressCategory('lockup')}>
            Mining
          </div>
          <div
            className={`filter-button ${catFilter === 'none' && 'active'}`}
            onClick={() => handlePressCategory('none')}>
            None
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: -30}}>
          {/* <button
                        className="secondary-button grid-button"
                        // onClick={() => history.push('/new-property')}
                    >
                        <MdLockOpen size={18} style={{ marginRight: 10 }} />
                        {'All User Unlock'}
                    </button> */}
          {/* <button
                        className="primary-button grid-button"
                        // onClick={() => history.push('/new-property')}
                    >
                        <MdLockOutline size={18} style={{ marginRight: 10 }} />
                        {'Lock'}
                    </button> */}
          <input
            type="text"
            className="search-form"
            placeholder="Search for E-mail / Name / Mobile"
            value={filterValue}
            onChange={handleChangeFilterValue}
            onKeyPress={handlePressKey}
          />
          <button
            type="button"
            className="search-button"
            style={{top: 58}}
            onClick={handleClickSearch}>
            <GoSearch size={18} style={{marginRight: 10}} />
          </button>
        </div>
      </div>

      <Grid
        style={{height: '85%', width: '100%'}}
        data={
          users &&
          users.length > 0 &&
          filterBy(orderBy(users, sort), filter).filter(categoryFilter)
        }
        onSortChange={(e) => setSort(e.sort)}
        sort={sort}
        resizable
        sortable>
        {/* <Column
                    field="lockUp"
                    title="Lock Up"
                    width="100px"
                    locked
                    cell={(props) => (
                        <td colSpan="1" className="k-grid-content-sticky locked-left">
                            {props.dataItem.lockUp && (
                                <MdLockOutline
                                    size={20}
                                    style={{ marginBottom: '-3px', marginRight: '5px' }}
                                />
                            )}
                        </td>
                    )}
                /> */}
        <Column field="email" title="E-mail" width="200px" />
        <Column field="name" title="Name" width="150px" />
        <Column field="phoneNumber" title="Mobile" width="150px" />
        <Column field="address" title="Address" />
        <Column
          field="lockUp"
          title="Lock Up"
          width="100px"
          cell={(props) => (
            <td colSpan="1">
              {props.dataItem.lockUp && (
                <MdLockOutline
                  size={20}
                  style={{marginBottom: '-3px', marginRight: '5px'}}
                />
              )}
            </td>
          )}
        />
        <Column field="lockUpRate" title="Lock Up Rate" width="150px" />
        <Column
          field="lockUpPeriod"
          title="Lock Up Period"
          width="180px"
          cell={(props) => (
            <td>
              <span>
                {props.dataItem.lockUpPeriod &&
                  timeConverter(props.dataItem.lockUpPeriod)}
              </span>
            </td>
          )}
        />
        <Column
          title=""
          width="130px"
          locked
          cell={(props) => (
            <td className="k-grid-content-sticky locked-right">
              <button
                onClick={() => handleClickModalOpen(props.dataItem)}
                className="simple-circle-button"
                style={{marginLeft: 10}}>
                <MdCreate size={20} />
              </button>
            </td>
          )}
        />
      </Grid>
      {isModalOpen && (
        <LockUpModal
          message={`Are you sure you want to delete`}
          data={modalData}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          fetchFunction={fetchData}
          // confirmFunction={handleDeleteDiamond}
        />
      )}
    </div>
  );
}

export default UserMining;
