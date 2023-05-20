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
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Car: carFixtures.oneCar,
    submitText: "",
    submitAction: () => { }
};


