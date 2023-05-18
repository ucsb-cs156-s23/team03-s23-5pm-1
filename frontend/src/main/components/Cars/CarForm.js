import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RestaurantForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    const navigate = useNavigate();
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker enable all
   
    const testIdPrefix = "CarForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="make">Make</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-make"}
                    id="make"
                    type="text"
                    isInvalid={Boolean(errors.make)}
                    {...register("make", {
                        required: "Make is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.make?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="model">Model</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-model"}
                    id="model"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("model", {
                        required: "Model is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.model?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="year">Year</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-year"}
                    id="year"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("year", {
                        required: "Year is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.year?.message}
                </Form.Control.Feedback>
            </Form.Group>



            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RestaurantForm;