import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { carUtils } from "main/utils/carUtils";

const showCell = (cell) => JSON.stringify(cell.row.values)

const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    carUtils.del(cell.row.values.id);
}

export default function CarTable({
    cars,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "CarTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/cars/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/cars/details/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Make',
            accessor: 'make',
        },
        {
            Header: 'Model',
            accessor: 'model',
        },
        {
            Header: 'Year',
            accessor: 'year',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={cars}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };