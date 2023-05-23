import { carFixtures } from "fixtures/carFixtures";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/carUtils";

describe("carUtils tests", () => {

    test("Testing axiosDeleteConfig" , () => {
        const cell = {
            "row" : {"values" : {"id":1,"make":"Toyota","model":"Camry","year":"2022"}}
        };
        const message = JSON.stringify(cellToAxiosParamsDelete(cell));
        const expectedMessage = `{"url":"/api/cars","method":"DELETE","params":{"id":1}}`;
        expect(message).toMatch(expectedMessage);
   });

});