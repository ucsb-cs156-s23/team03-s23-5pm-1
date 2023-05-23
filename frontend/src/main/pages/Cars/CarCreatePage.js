import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CarForm from "main/components/Cars/CarForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CarCreatePage() {



  const objectToAxiosParams = (car) => ({
    url: "/api/cars/post",
    method: "POST",
    params: {
      make: car.make,
      model: car.model,
      year: car.year
    }
  });

  const onSuccess = (car) => {
    toast(`New car Created - id: ${car.id} make: ${car.make}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/cars/all"]
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
        <h1>Create New Car</h1>
        <CarForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
