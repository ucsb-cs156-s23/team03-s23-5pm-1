import { carFixtures } from "fixtures/carFixtures";
import { carUtilities } from "main/utils/carUtils";

describe("carUtilities tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "cars".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "cars") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When cars is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.get();

            // assert
            const expected = { nextId: 1, cars: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cars", expectedJSON);
        });

        test("When cars is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.get();

            // assert
            const expected = { nextId: 1, cars: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cars", expectedJSON);
        });

        test("When cars is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, cars: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.get();

            // assert
            const expected = { nextId: 1, cars: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When cars is JSON of three cars, should return that JSON", () => {

            // arrange
            const threeCars = carFixtures.threeCars;
            const mockCarCollection = { nextId: 10, cars: threeCars };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockCarCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.get();

            // assert
            expect(result).toEqual(mockCarCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a car by id works", () => {

            // arrange
            const threeCars = carFixtures.threeCars;
            const idToGet = threeCars[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            // act
            const result = carUtilities.getById(idToGet);

            // assert

            const expected = { car: threeCars[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing car returns an error", () => {

            // arrange
            const threeCars = carFixtures.threeCars;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            // act
            const result = carUtilities.getById(99);

            // assert
            const expectedError = `car with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCars = carFixtures.threeCars;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            // act
            const result = carUtilities.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one car works", () => {

            // arrange
            const car = carFixtures.oneCar[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, cars: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.add(car);

            // assert
            expect(result).toEqual(car);
            expect(setItemSpy).toHaveBeenCalledWith("cars",
                JSON.stringify({ nextId: 2, cars: carFixtures.oneCar }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing car works", () => {

            // arrange
            const threeCars = carFixtures.threeCars;
            const updatedCar = {
                ...threeCars[0],
                name: "Updated Name"
            };
            const threeCarsUpdated = [
                updatedCar,
                threeCars[1],
                threeCars[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.update(updatedCar);

            // assert
            const expected = { carCollection: { nextId: 5, cars: threeCarsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cars", JSON.stringify(expected.carCollection));
        });
        test("Check that updating an non-existing car returns an error", () => {

            // arrange
            const threeCars = carFixtures.threeCars;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedCar = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = carUtilities.update(updatedCar);

            // assert
            const expectedError = `car with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a car by id works", () => {

            // arrange
            const threeCars = carFixtures.threeCars;
            const idToDelete = threeCars[1].id;
            const threeCarsUpdated = [
                threeCars[0],
                threeCars[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.del(idToDelete);

            // assert

            const expected = { carCollection: { nextId: 5, cars: threeCarsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("cars", JSON.stringify(expected.carCollection));
        });
        test("Check that deleting a non-existing car returns an error", () => {

            // arrange
            const threeCars = carFixtures.threeCars;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = carUtilities.del(99);

            // assert
            const expectedError = `car with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCars = carFixtures.threeCars;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, cars: threeCars }));

            // act
            const result = carUtilities.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});