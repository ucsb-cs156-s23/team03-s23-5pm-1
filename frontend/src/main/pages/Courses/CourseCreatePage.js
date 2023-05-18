import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { useNavigate } from 'react-router-dom'
import { courseUtilities } from 'main/utils/courseUtilities';
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function CourseCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (course) => {
    const createdCourse = courseUtilities.add(course);
    console.log("createdCourse: " + JSON.stringify(createdCourse));
    navigate("/courses");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Course</h1>
        <CourseForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
