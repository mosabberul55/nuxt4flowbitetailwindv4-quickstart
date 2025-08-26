import { useForm } from 'vee-validate';
import * as yup from 'yup';

export function useForgotPasswordForm() {
    const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
        validationSchema: yup.object({
            email: yup.string().required().email().label('Email'),
        }),
    });

    const [email] = defineField('email');

    return {
        errors,
        handleSubmit,
        resetForm,
        setErrors,
        email,
    };
}