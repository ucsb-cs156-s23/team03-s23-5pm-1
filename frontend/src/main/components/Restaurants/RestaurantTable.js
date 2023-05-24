import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
// Stryker disable next-line all
const showCell = (cell) => JSON.stringify(cell.row.values);

export default function RestaurantTable({
    restaurants, currentUser,
    showButtons = true,
    testIdPrefix = "RestaurantTable" }) {

    const navigate = useNavigate();
    // Stryker disable all
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/restaurants/edit/${cell.row.values.id}`)
    }
    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/restaurants/details/${cell.row.values.id}`)
    }
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/restaurants/all"]
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
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Description',
            accessor: 'description',
        }
    ];

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
      columns.push(ButtonColumn("Details", "primary", detailsCallback, testIdPrefix ));
      columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix ));
      columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix ));
	  }

	// Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
	const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedRestaurants = React.useMemo(() => restaurants, [restaurants]);

	return <OurTable
		data={memoizedRestaurants}
		columns={memoizedColumns}
		testid={testIdPrefix }
	/>;
};

//export { showCell };