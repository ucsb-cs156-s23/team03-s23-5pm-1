import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/carUtils"
import { hasRole } from "main/utils/currentUser";

const showCell = (cell) => JSON.stringify(cell.row.values)

export default function CarTable({
    cars, currentUser, 
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

        // Stryker disable next-line all
        const deleteMutation = useBackendMutation(
            cellToAxiosParamsDelete,
            { onSuccess: onDeleteSuccess },
            // Stryker disable next-line all
            ["/api/course/all"]
        );
        // Stryker enable all 

      // Stryker disable next-line all : TODO try to make a good test for this
      const deleteCallback = async (cell) => { 
        console.log(`deleteCallback: ${showCell(cell)})`);
        deleteMutation.mutate(cell); 
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

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
		columns.push(ButtonColumn("Details", "primary", detailsCallback, testIdPrefix ));
		columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix ));
		columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix ));
	}

	// Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
	const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedCars = React.useMemo(() => cars, [cars]);

    	return <OurTable
		data={memoizedCars}
		columns={memoizedColumns}
		testid={testIdPrefix }
	/>;
};

