import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CourseTable from 'main/components/Courses/CourseTable';
import { courseUtilities } from 'main/utils/courseUtilities';

export default function CourseDetailsPage() {
  let { id } = useParams();

  const response = courseUtilities.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Course Details</h1>
        <CourseTable courses={[response.course]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
