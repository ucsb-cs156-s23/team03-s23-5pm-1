import React from 'react';
import CarTable from 'main/components/Cars/CarTable';
import { carFixtures } from 'fixtures/carFixtures';

export default {
    title: 'components/Cars/CarTable',
    component: CarTable
};

const Template = (args) => {
    return (
        <CarTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    cars: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    cars: carFixtures.threeCars,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    cars: carFixtures.threeCars,
    showButtons: true
};
