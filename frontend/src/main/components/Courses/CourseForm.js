import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
function CourseForm({ initialCourse, submitAction, buttonLabel="Create" }) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialCourse || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();


    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialCourse && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="CourseForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialCourse.id}
                        disabled
                    />
                </Form.Group>
            )}
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid="CourseForm-title"
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="number">Number</Form.Label>
                <Form.Control
                    data-testid="CourseForm-number"
                    id="number"
                    type="number"
                    isInvalid={Boolean(errors.number)}
                    {...register("number", { 
                        required: "Number is required.",
                        valueAsNumber: true
                     })}

                />
                <Form.Control.Feedback type="invalid">
                    {errors.number && 'Number is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="instructor">Instructor</Form.Label>
                <Form.Control
                    data-testid="CourseForm-instructor"
                    id="instructor"
                    type="text"
                    isInvalid={Boolean(errors.instructor)}
                    {...register("instructor", { 
                        required: "Instructor is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.instructor && 'Instructor is required.'}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={"CourseForm-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={"CourseForm-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default CourseForm;