import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { GoSearch } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import * as moment from "moment";
import ReactExport from "react-export-excel";

import { getAllLists } from "../apis/ethSwap";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ethSwap() {
    const [totalLists, setTotalLists] = useState([]);
    const [lists, setLists] = useState([]);
    const [sort, setSort] = useState([{ field: "", dir: "DESC" }]);

    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(20);
    const [total, setTotal] = useState(0);

    const [filterValue, setFilterValue] = useState("");
    const [filter, setFilter] = useState({
        logic:   "or",
        filters: [
            { field: "email", operator: "contains", value: "" },
            { field: "name", operator: "contains", value: "" },
            { field: "phoneNumber", operator: "contains", value: "" },
            { field: "address", operator: "contains", value: ""}
        ]
    });

    const fetchData = async () => {
        const response = await getAllLists();

        if (!response) {
            return;
        }

        if (response && response.data) {
            setLists(response.data.lists);
            setTotal(response.data.total);
            /*setSkip(response.data.pageable.page * response.data.pageable.size);
            setTake(response.data.pageable.size);*/
        }
    }

    const fetchDataAll = async () => {
        const response = await getAllLists();

        if (!response) {
            return;
        }

        if (response && response.data) {
            setTotalLists(response.data.lists);
        }
    }

    useEffect(() => {
        fetchData({
            page:      1,
            size:      20,
            order:     "",
            direction: "DESC",
            search:    ""
        });
        fetchDataAll();
    }, []);

    const handleChangeFilterValue = (e) => {
        setFilterValue(e.target.value);
    };

    const handlePressKey = (e) => {
        if ( e.key === "Enter" ) {
            handleClickSearch();
        }
    };

    const getCurrentTimeForFilename = () => {
        return moment().format("YYYY-MM-D--hh-mm-ss");
    };

    const pageChange = async (event) => {
        setSkip(event.page.skip);
        setTake(event.page.take);
        await fetchData({
            page:      (event.page.skip / event.page.take) + 1,
            size:      event.page.take,
            order:     sort[0] ? sort[0].field : "",
            direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
            search:    filterValue
        });
    };

    const handleClickSearch = async () => {
        await fetchData({
            page:      1,
            size:      take,
            order:     sort[0] ? sort[0].field : "",
            direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
            search:    filterValue
        });
    };

    const sortChange = (sort) => {
        setSort(sort);
        console.log(skip, take);
        fetchData({
            page:      (skip / take) + 1,
            size:      take,
            order:     sort[0] ? sort[0].field : "",
            direction: sort[0] ? sort[0].dir.toUpperCase() : "DESC",
            search:    filterValue
        });
    };

    return (
        <div className="content">
            <div className="content-title title-row">
                <span>ETH Swap Log</span>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <ExcelFile
                        filename={`ETH-SWAP-LOG-${getCurrentTimeForFilename()}`}
                        element={
                            <button
                                style={{ marginLeft: 15 }}
                                className="secondary-button grid-button">
                                <FiUpload size={15} style={{ marginRight: 10 }} />
                                {"Export to Excel"}
                            </button>
                        }>
                        <ExcelSheet data={totalLists} name="All">
                            <ExcelColumn label="Token" value="token" />
                            <ExcelColumn label="Address" value="addr" />
                            <ExcelColumn label="ETH Address" value="ethAddr" />
                            <ExcelColumn label="ETH TXID" value="ethTxid" />
                            <ExcelColumn label="Value" value="value" />
                            <ExcelColumn label="ETH Value" value="ethValue" />
                            <ExcelColumn label="Swap Date" value="date" />
                        </ExcelSheet>
                    </ExcelFile>
                    {/*<input
                        type="text"
                        className="search-form"
                        placeholder="Search for E-mail / Name / Mobile / Address"
                        value={filterValue}
                        onChange={handleChangeFilterValue}
                        onKeyPress={handlePressKey}
                    />
                    <button
                        type="button"
                        className="search-button"
                        style={{ top: 14, right: 50 }}
                        onClick={handleClickSearch}>
                        <GoSearch size={18} style={{ marginRight: 10 }} />
                    </button>*/}
                </div>
            </div>

            <Grid
                style={{ height: "90%", width: "100%" }}
                data={lists}
                onSortChange={(e) => sortChange(e.sort)}
                // onSortChange={(e) => console.log(e)}
                sort={sort}
                resizable
                total={total}
                pageable
                skip={skip}
                take={take}
                onPageChange={pageChange}
                sortable>
                <Column field="token" title="Token" width="100px" />
                <Column field="addr" title="Address" />
                <Column field="ethAddr" title="ETH Address" />
                <Column field="ethTxid" title="ETH TXID" cell={ (props) =>
                    <td>
                        <a href={"https://etherscan.io/tx/" + props.dataItem.ethTxid}>
                            { props.dataItem.ethTxid }
                        </a>
                    </td>
                }/>
                <Column field="value" title="Value" width="245px" cell={ (props) =>
                    <td>
                        { props.dataItem.value + " " + props.dataItem.token }
                    </td>
                }/>
                <Column field="ethValue" title="ETH Value" width="245px" cell={ (props) =>
                    <td>
                        { props.dataItem.ethValue + " ETH" }
                    </td>
                }/>
                <Column field="date" width="200px" title="Swap Date" />
            </Grid>
        </div>
    );
}

export default ethSwap;
