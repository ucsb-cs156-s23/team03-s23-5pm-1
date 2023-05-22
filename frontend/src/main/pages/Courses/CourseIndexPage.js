import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseTable from 'main/components/Courses/CourseTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function CourseIndexPage() {

    
  const currentUser = useCurrentUser();

  const { data: courses, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/course/all"],
      { method: "GET", url: "/api/course/all" },
      []
    );

    return (
        <BasicLayout>
          <div className="pt-2">
            <h1>Courses</h1>
            <CourseTable courses={courses} currentUser={currentUser} />
          </div>
        </BasicLayout>
      )
}