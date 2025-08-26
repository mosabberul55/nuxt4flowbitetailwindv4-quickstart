import { useForm } from 'vee-validate';
import * as yup from 'yup';

export function useResetPasswordForm() {
    const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
        validationSchema: yup.object({
            password: yup.string().required().min(6).label('Password'),
            confirm_password: yup
                .string()
                .oneOf([yup.ref('password')], 'Confirm Password must match New Password')
                .required()
                .label('Confirm Password'),
        }),
    });

    const [password] = defineField('password');
    const [confirm_password] = defineField('confirm_password');

    return {
        errors,
        handleSubmit,
        resetForm,
        setErrors,
        password,
        confirm_password,
    };
}
