
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { courseUtilities }  from 'main/utils/courseUtilities';
import CourseForm from 'main/components/Courses/CourseForm';
import { useNavigate } from 'react-router-dom'


export default function CourseEditPage() {
    let { id } = useParams();

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
}