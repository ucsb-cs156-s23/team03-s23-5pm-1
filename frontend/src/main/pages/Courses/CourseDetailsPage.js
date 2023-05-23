import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CourseTable from 'main/components/Courses/CourseTable';
//import { courseUtilities } from 'main/utils/courseUtilities';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';
//import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
//import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
//import axios from "axios";
//import AxiosMockAdapter from "axios-mock-adapter";
//Stryker disable all
export default function CourseDetailsPage() {
  let { id } = useParams();

  //const response = courseUtilities.getById(id);

  const currentUser = useCurrentUser();

  const { data: course, error:_error, status:_status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/course?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/course`,
      params: {
        id
      }
    },
    []
  );
    //console.log(course)
    return (
        <BasicLayout>
          <div className="pt-2">
            <h1>Course Details</h1>
            <CourseTable courses={[course]} currentUser={currentUser} showButtons={false}/>
          </div>
        </BasicLayout>
      )
}
