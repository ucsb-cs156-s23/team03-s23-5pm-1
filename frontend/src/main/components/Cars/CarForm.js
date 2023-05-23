import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
function CarForm({ initialCars, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialCars || {}, }
    );
    // Stryker enable all
    const navigate = useNavigate();

    const testIdPrefix = "CarForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialCars && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialCars.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="make">Make</Form.Label>
                <Form.Control
                    data-testid={"CarForm-make"}
                    id="make"
                    type="text"
                    isInvalid={Boolean(errors.make)}
                    {...register("make", {
                        required: "Make is required.",

                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.make?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="model">Model</Form.Label>
                <Form.Control
                    data-testid={"CarForm-model"}
                    id="model"
                    type="text"
                    isInvalid={Boolean(errors.model)}
                    {...register("model", {
                        required: "Model is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.model && 'Model is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="year">Year</Form.Label>
                <Form.Control
                    data-testid={"CarForm-year"}
                    id="year"
                    type="number"
                    isInvalid={Boolean(errors.year)}
                    {...register("year", {
                        required: "Year is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.year && 'Year is required. '}
                </Form.Control.Feedback>
            </Form.Group>



            <Button
                type="submit"
                data-testid={"CarForm-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={"CarForm-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default CarForm;