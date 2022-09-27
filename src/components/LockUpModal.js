import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import useForm from 'react-hook-form';
import Switch from 'react-switch';
import {IoIosClose} from 'react-icons/io';
import {inject, observer} from 'mobx-react';

import {timeConverterNumberArr} from '../utils/string';
import {updateUserLockUp} from '../apis/admin';
import {decodeCookieData, getCookie} from '../utils/auth';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 220,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(130, 130, 130, 0.15)',
        zIndex: 60,
    },
    content: {
        top: '47%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        width: '450px',
        height: '400px',
        border: '0px',
    },
};

const LockUpModal = ({isOpen, setIsOpen, data, fetchFunction}) => {
    const [lockUp, setLockup] = useState(false);
    const [date, setDate] = useState([]);
    const {register, handleSubmit} = useForm();

    useEffect(() => {
        const setInitialDate = ({lockUpPeriod}) => {
            if (lockUpPeriod) {
                const date = timeConverterNumberArr(data.lockUpPeriod || '');
                setDate(date);
            }
        };
        setLockup(data.lockUp);
        setInitialDate(data);
    }, [data]);

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleChange = async (lockUp) => {
        setLockup(lockUp);
    };

    const formatDate = (day, month, year) => {
        if (day && month && year) {
            // console.log(`${year}-${month}-${day}T14:59:59`)
            return `${year}-${
                parseInt(month) < 10
                    ? '0' + parseInt(month)
                    : '' + parseInt(month)
            }-${
                parseInt(day) < 10 ? '0' + parseInt(day) : '' + parseInt(day)
            }T14:59:59`;
        }
        return '';
    };

    const onSubmit = async ({rate, day, month, year}) => {
        const { accessToken } = decodeCookieData(getCookie('key'));
        const response = await updateUserLockUp(accessToken, {
            emailAddress: data.emailAddress,
            lockUp,
            lockUpRate: rate || null,
            lockUpPeriod: formatDate(day, month, year)
        });

        if (!response) {
            alert("Updating Lock Up failed. Please check the input");
            return;
        }
        if (response.status === "fail") {
            alert("Updating Lock Up failed. Please check the input");
            return;
        }

        if (response.status === "success") {
            fetchFunction();
            closeModal();
        }
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={isOpen}
            closeTimeoutMS={300}
            style={customStyles}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={false}>
            <div className="frame">
                <div className="scroll">
                    <div
                        className="modal-header"
                        style={{
                            width: '450px',
                            boxShadow:
                                '0px 17px 10px -17px rgba(131, 131, 131, 0.2)',
                        }}>
                        <div className="header-button">
                            <span className="title">
                                Change Lock Up Config&nbsp;
                            </span>
                        </div>
                        <div className="header-button">
                            <button type="button" onClick={closeModal}>
                                <IoIosClose size={30} />
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-content lockup-modal"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            height: '340px',
                            fontFamily: 'inherit',
                        }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* <div style={{ textAlign: 'center', borderWidth: 1 }}> */}
                            <div className="input-wrapper">
                                <div className="input-title">Lock Up</div>
                                <Switch
                                    className="switch-wrapper"
                                    height={33}
                                    width={80}
                                    onChange={handleChange}
                                    checked={lockUp}
                                    onColor={'#02AAB0'}
                                />
                            </div>
                            <div className="input-wrapper">
                                <div className="input-title">Lock Up Rate</div>
                                <input
                                    className={`input-text ${!lockUp &&
                                    'disabled'}`}
                                    name="rate"
                                    type="number"
                                    defaultValue={data.lockUpRate}
                                    ref={register}
                                    disabled={!lockUp}
                                />
                                <span className="unit">%</span>
                            </div>
                            <div className="input-wrapper">
                                <div className="input-title">
                                    Lock Up Period
                                </div>
                                <input
                                    className={`input-date ${!lockUp &&
                                    'disabled'}`}
                                    name="day"
                                    type="number"
                                    ref={register}
                                    placeholder={'dd'}
                                    defaultValue={date[0] || ''}
                                    disabled={!lockUp}
                                    maxLength="2"
                                    max={31}
                                />
                                <span className="divider">/</span>
                                <input
                                    className={`input-date ${!lockUp &&
                                    'disabled'}`}
                                    name="month"
                                    type="number"
                                    ref={register}
                                    placeholder={'mm'}
                                    defaultValue={date[1] || ''}
                                    disabled={!lockUp}
                                    maxLength="2"
                                />
                                <span className="divider">/</span>
                                <input
                                    className={`input-date ${!lockUp &&
                                    'disabled'}`}
                                    name="year"
                                    type="number"
                                    ref={register}
                                    placeholder={'yyyy'}
                                    defaultValue={date[2] || ''}
                                    disabled={!lockUp}
                                    maxLength="4"
                                />
                                <span></span>
                            </div>
                            {/* </div> */}
                            <div style={{display: 'flex', marginTop: 30}}>
                                <button
                                    type="button"
                                    className="simple-button"
                                    onClick={closeModal}
                                    style={{marginRight: 40}}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-button"
                                    // onClick={() => confirmFunction(params)}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default inject('snackbarStore')(observer(LockUpModal));
