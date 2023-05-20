<<<<<<< HEAD
import React from "react";
import CarForm from "main/components/Cars/CarForm";
import { Fixtures } from "fixtures/carFixtures";

export default {
  title: "components/Cars/CarForm",
  component: CarForm,
};

const Template = (args) => {
  return <CarForm {...args} />;
=======
import React from 'react';
import CarForm from "main/components/Cars/CarForm"
import { carFixtures } from 'fixtures/carFixtures';

export default {
    title: 'components/Cars/CarForm',
    component: CarForm
};

const Template = (args) => {
    return (
        <CarForm {...args} />
    )
>>>>>>> 4a82bcad19f3f35883209879e79b1730290567df
};

export const Default = Template.bind({});

Default.args = {
<<<<<<< HEAD
  submitText: "Create",
  submitAction: () => {
    console.log("Submit was clicked");
  },
=======
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
>>>>>>> 4a82bcad19f3f35883209879e79b1730290567df
};

export const Show = Template.bind({});

Show.args = {
<<<<<<< HEAD
  Car: carFixtures.oneCar,
  submitText: "",
  submitAction: () => {},
};
=======
    Car: carFixtures.oneCar,
    submitText: "",
    submitAction: () => { }
};


>>>>>>> 4a82bcad19f3f35883209879e79b1730290567df
