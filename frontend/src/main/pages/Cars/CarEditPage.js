
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { carUtils }  from 'main/utils/carUtils';
import CarForm from 'main/components/Cars/CarForm';
import { useNavigate } from 'react-router-dom'


export default function CarEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = carUtils.getById(id);

    const onSubmit = async (car) => {
        const updatedCar = carUtils.update(car);
        console.log("updatedCar: " + JSON.stringify(updatedCar));
        navigate("/cars");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Car</h1>
                <CarForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.car}/>
            </div>
        </BasicLayout>
    )
}