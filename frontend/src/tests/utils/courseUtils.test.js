import { courseFixtures } from "fixtures/courseFixtures";
import { courseUtilities } from "main/utils/courseUtilities";

describe("courseUtilities tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "courses".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "courses") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When courses is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.get();

            // assert
            const expected = { nextId: 1, courses: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("courses", expectedJSON);
        });

        test("When courses is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.get();

            // assert
            const expected = { nextId: 1, courses: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("courses", expectedJSON);
        });

        test("When courses is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, courses: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.get();

            // assert
            const expected = { nextId: 1, courses: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When courses is JSON of three courses, should return that JSON", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;
            const mockCourseCollection = { nextId: 10, courses: threeCourses };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockCourseCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.get();

            // assert
            expect(result).toEqual(mockCourseCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a course by id works", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;
            const idToGet = threeCourses[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            // act
            const result = courseUtilities.getById(idToGet);

            // assert

            const expected = { course: threeCourses[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing course returns an error", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            // act
            const result = courseUtilities.getById(99);

            // assert
            const expectedError = `course with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            // act
            const result = courseUtilities.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one course works", () => {

            // arrange
            const course = courseFixtures.oneCourse[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, courses: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.add(course);

            // assert
            expect(result).toEqual(course);
            expect(setItemSpy).toHaveBeenCalledWith("courses",
                JSON.stringify({ nextId: 2, courses: courseFixtures.oneCourse }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing course works", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;
            const updatedCourse = {
                ...threeCourses[0],
                name: "Updated Name"
            };
            const threeCoursesUpdated = [
                updatedCourse,
                threeCourses[1],
                threeCourses[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.update(updatedCourse);

            // assert
            const expected = { courseCollection: { nextId: 5, courses: threeCoursesUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("courses", JSON.stringify(expected.courseCollection));
        });
        test("Check that updating an non-existing course returns an error", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedCourse = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = courseUtilities.update(updatedCourse);

            // assert
            const expectedError = `course with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a course by id works", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;
            const idToDelete = threeCourses[1].id;
            const threeCoursesUpdated = [
                threeCourses[0],
                threeCourses[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.del(idToDelete);

            // assert

            const expected = { courseCollection: { nextId: 5, courses: threeCoursesUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("courses", JSON.stringify(expected.courseCollection));
        });
        test("Check that deleting a non-existing course returns an error", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = courseUtilities.del(99);

            // assert
            const expectedError = `course with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeCourses = courseFixtures.threeCourses;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, courses: threeCourses }));

            // act
            const result = courseUtilities.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

