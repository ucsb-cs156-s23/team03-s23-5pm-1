import { courseFixtures } from "fixtures/courseFixtures";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/courseUtilities";

describe("courseUtilities tests", () => {

   test("Testing axiosDeleteConfig" , () => {
        const cell = {
            "row" : {"values" : {"id":1,"title":"ECE 153B - SNSR/PERPH INT DSGN","number":"59261","instructor":"Electrical and Computer Engineering"}}
        };
        const message = JSON.stringify(cellToAxiosParamsDelete(cell));
        const expectedMessage = `{"url":"/api/course","method":"DELETE","params":{"id":1}}`;
        expect(message).toMatch(expectedMessage);
   });

});

