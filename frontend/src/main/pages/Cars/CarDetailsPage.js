import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CarTable from "main/components/Cars/CarTable";
import { carUtils } from "main/utils/carUtils";
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';
//import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
//import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
//import axios from "axios";
//import AxiosMockAdapter from "axios-mock-adapter";
//Stryker disable all
export default function CarDetailsPage() {
  let { id } = useParams();

   


  //const response = carUtils.getById(id);

  const currentUser= useCurrentUser();

  const { data: car, error:_error, status:_status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/cars?id=${id}`],
    {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/cars`,
      params: {
        id
      }
    },
     // Stryker disable next-line all : don't test internal caching of React Query
    []
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Car Details</h1>
        <CarTable cars={[car]} currentUser={currentUser} showButtons={false} />
      </div>
    </BasicLayout>
  );
}
