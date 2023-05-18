const get = () => {
    const carValue = localStorage.getItem("cars");
    if (carValue === undefined) {
        const carCollection = { nextId: 1, cars: [] };
        return set(carCollection);
    }
    const carCollection = JSON.parse(carValue);
    if (carCollection === null) {
        const carCollection = { nextId: 1, cars: [] };
        return set(carCollection);
    }
    return carCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const carCollection = get();
    const cars = carCollection.cars;

    /* eslint-disable-next-line eqeqeq */
    const index = cars.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `car with id ${id} not found`};
    }
    return { car: cars[index] };
};

const set = (carCollection) => {
    localStorage.setItem("cars", JSON.stringify(carCollection));
    return carCollection;
};

const add = (car) => {
    const carCollection = get();
    car = { ...car, id: carCollection.nextId };
    carCollection.nextId++;
    carCollection.cars.push(car);
    set(carCollection);
    return car;
};

const update = (car) => {
    const carCollection = get();
    const cars = carCollection.cars;

    /* eslint-disable-next-line eqeqeq */
    const index = cars.findIndex((r) => r.id == car.id);
    if (index === -1) {
        return { "error": `car with id ${car.id} not found` };
    }
    cars[index] = car;
    set(carCollection);
    return { carCollection: carCollection};
};

const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const carCollection = get();
    const cars = carCollection.cars;

    /* eslint-disable-next-line eqeqeq */
    const index = cars.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `car with id ${id} not found` };
    }
    cars.splice(index, 1);
    set(carCollection);
    return { carCollection: carCollection };
};

const carUtilities = {
    get,
    getById,
    add,
    update,
    del
};

export { carUtilities };