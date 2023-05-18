const get = () => {
    const courseValue = localStorage.getItem("courses");
    if (courseValue === undefined) {
        const courseCollection = { nextId: 1, courses: [] };
        return set(courseCollection);
    }
    const courseCollection = JSON.parse(courseValue);
    if (courseCollection === null) {
        const courseCollection = { nextId: 1, courses: [] };
        return set(courseCollection);
    }
    return courseCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const courseCollection = get();
    const courses = courseCollection.courses;

    /* eslint-disable-next-line eqeqeq */
    const index = courses.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `course with id ${id} not found` };
    }
    return { course: courses[index] };
};

const set = (courseCollection) => {
    localStorage.setItem("courses", JSON.stringify(courseCollection));
    return courseCollection;
};

const add = (course) => {
    const courseCollection = get();
    course = { ...course, id: courseCollection.nextId };
    courseCollection.nextId++;
    courseCollection.courses.push(course);
    set(courseCollection);
    return course;
};

const update = (course) => {
    const courseCollection = get();
    const courses = courseCollection.courses;

    /* eslint-disable-next-line eqeqeq */
    const index = courses.findIndex((r) => r.id == course.id);
    if (index === -1) {
        return { "error": `course with id ${course.id} not found` };
    }
    courses[index] = course;
    set(courseCollection);
    return { courseCollection: courseCollection };
};

const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const courseCollection = get();
    const courses = courseCollection.courses;

    /* eslint-disable-next-line eqeqeq */
    const index = courses.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `course with id ${id} not found` };
    }
    courses.splice(index, 1);
    set(courseCollection);
    return { courseCollection: courseCollection };
};

const courseUtilities = {
    get,
    getById,
    add,
    update,
    del
};

export { courseUtilities };