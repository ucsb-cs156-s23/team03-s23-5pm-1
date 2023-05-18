import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseTable from 'main/components/Courses/CourseTable';
import { courseUtilities } from 'main/utils/courseUtilities';
import { useNavigate, Link } from 'react-router-dom';
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function CourseIndexPage() {

    const navigate = useNavigate();

    const courseCollection = courseUtilities.get();
    const courses = courseCollection.courses;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`CourseIndexPage deleteCallback: ${showCell(cell)})`);
        courseUtilities.del(cell.row.values.id);
        navigate("/courses");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/courses/create">
                    Create Course
                </Button>
                <h1>Courses</h1>
                <CourseTable courses={courses} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}