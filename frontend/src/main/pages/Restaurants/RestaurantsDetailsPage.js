import { useBackend, useBackendMutation } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';

export default function RestaurantDetailsPage() {
  let { id } = useParams();

  const { data: restaurants, error: _error, status: _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/restaurants/all"],
    { method: "GET", url: "/api/restaurants/all" },
    []
  );

  let restaurantsWithId = [];

  (restaurants).forEach(restaurant => {
    if(restaurant.id === id)
      restaurantsWithId.push(restaurant)
  });

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={restaurantsWithId} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
