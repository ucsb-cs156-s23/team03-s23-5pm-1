import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
/*
import { courseUtilities } from 'main/utils/courseUtilities';
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
*/
export default function CourseCreatePage() {

  const objectToAxiosParams = (course) => ({
    url: "/api/course/post",
    method: "POST",
    params: {
      title: course.title,
      number: course.number,
      instructor: course.instructor
    }
  });
  const onSuccess = (course) => {
    toast(`New Course Created - id: ${course.id} title: ${course.title}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/course/all"]
     );
  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/courses" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Course</h1>

        <CourseForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
/*
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
  */
}
