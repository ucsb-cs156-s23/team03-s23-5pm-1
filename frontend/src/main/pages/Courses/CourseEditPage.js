import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function CourseEditPage() {
    let { id } = useParams();

    const { data: course, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/course?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/course`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (course) => ({
        url: "/api/course",
        method: "PUT",
        params: {
          id: course.id,
        },
        data: {
          title: course.title,
          number: course.number,
          instructor: course.instructor
        }
    });

    const onSuccess = (course) => {
        toast(`Course Updated - id: ${course.id} title: ${course.title}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/course?id=${id}`]
    );

    const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/course/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Course</h1>
        {course &&
          <CourseForm initialCourse={course} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )

    /*
    let navigate = useNavigate(); 

    const response = courseUtilities.getById(id);

    const onSubmit = async (course) => {
        const updatedCourse = courseUtilities.update(course);
        console.log("updatedCourse: " + JSON.stringify(updatedCourse));
        navigate("/courses");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Course</h1>
                <CourseForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.course}/>
            </div>
        </BasicLayout>
    )
    */
}