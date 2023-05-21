import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CarForm from "main/components/Cars/CarForm";
import { useNavigate } from 'react-router-dom'
import { carUtils } from 'main/utils/carUtils';

export default function CarCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (car) => {
    const createdCar = carUtils.add(car);
    console.log("createdCar: " + JSON.stringify(createdCar));
    navigate("/cars");
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
