
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CarForm from 'main/components/Cars/CarForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function CarEditPage() {
    let { id } = useParams();


    const { data: car, error, status } =
    useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/cars?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/cars`,
        params: {
        id
        }
    }
    );

const objectToAxiosPutParams = (car) => ({
    url: "/api/cars",
    method: "PUT",
    params: {
        id: car.id,
    },
    data: {
        make: car.make,
        model: car.model,
        year: car.year
    }
});

const onSuccess = (car) => {
    toast(`Car Updated - id: ${car.id} make: ${car.make}`);
}

const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/cars?id=${id}`]
);

const { isSuccess } = mutation


const onSubmit = async (data) => {
    mutation.mutate(data);
}

if (isSuccess) {
    return <Navigate to="/cars" />
}

    return (
        <BasicLayout>
             <div className="pt-2">
          <h1>Edit Car</h1>
          {car &&
            <CarForm initialContents={car} submitAction={onSubmit} buttonLabel="Update" />
          }
        </div>
      </BasicLayout>
    )
}