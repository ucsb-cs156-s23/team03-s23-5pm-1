import React from 'react';
import CourseForm from "main/components/Courses/CourseForm"
import { courseFixtures } from 'fixtures/courseFixtures';

export default {
    title: 'components/Courses/CourseForm',
    component: CourseForm
};

const Template = (args) => {
    return (
        <CourseForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Course: courseFixtures.oneCourse,
    submitText: "",
    submitAction: () => { }
};