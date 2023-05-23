import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CarTable from 'main/components/Cars/CarTable';
import { useCurrentUser } from 'main/utils/currentUser'


export default function CarIndexPage() {

    const currentUser = useCurrentUser();



    const { data: cars, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/cars/all"],
      { method: "GET", url: "/api/cars/all" },
      []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
            <h1>Cars</h1>
        <CarTable cars={cars} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}