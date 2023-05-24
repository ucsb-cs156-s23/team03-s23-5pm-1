import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantUtils } from 'main/utils/restaurantUtils';
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { useCurrentUser } from 'main/utils/currentUser'
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function RestaurantsDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const response = restaurantUtils.getById(id);
  // Stryker disable all
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={[response]} currentUser={currentUser} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
