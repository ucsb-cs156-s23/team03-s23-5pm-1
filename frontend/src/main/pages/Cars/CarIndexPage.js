import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CarTable from 'main/components/Cars/CarTable';
import { carUtils } from 'main/utils/carUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function CarIndexPage() {

    const navigate = useNavigate();

    const carCollection = carUtils.get();
    const cars = carCollection.cars;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`CarIndexPage deleteCallback: ${showCell(cell)})`);
        carUtils.del(cell.row.values.id);
        navigate("/cars");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/cars/create">
                    Create Car
                </Button>
                <h1>Cars</h1>
                <CarTable cars={cars} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}