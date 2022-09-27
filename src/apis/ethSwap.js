import axios from "axios";

const getAllLists = async () => {
    try {
        const response = await axios.get(
            "https://swapapi.dmwwallet.com/api/v1/list/getalllists",
        );
        return response.data;
    } catch ( e ) {
        console.log(e);
    }
};

export {
    getAllLists
}
