import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils";

describe("restaurantUtils tests", () => {

   test("Testing axiosDeleteConfig" , () => {
        const cell = {
            "row" : {"values" : {
                "id": 2,
                "name": "Cristino's Bakery",
                "description": "This place is takeout only.  It may look mostly like a bakery with Mexican pastries, but it also has amazing burritos and tacos"
                }}
        };

        const message = JSON.stringify(cellToAxiosParamsDelete(cell));
        const expectedMessage = "{\"url\":\"/api/restaurants\",\"method\":\"DELETE\",\"params\":{\"id\":2}}"
        expect(message).toMatch(expectedMessage);
   });

});