import React from 'react';
import CourseTable from 'main/components/Courses/CourseTable';
import { courseFixtures } from 'fixtures/courseFixtures';

export default {
    title: 'components/Courses/CourseTable',
    component: CourseTable
};

const Template = (args) => {
    return (
        <CourseTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    courses: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    courses: courseFixtures.threeCourses,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    courses: courseFixtures.threeCourses,
    showButtons: true
};
