import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

// Stryker disable all
export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/restaurants",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}

const restaurantUtils = {
};

export {restaurantUtils}