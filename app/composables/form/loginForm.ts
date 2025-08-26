import { useForm } from 'vee-validate';
import * as yup from 'yup';
export function useLoginForm() {
    const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
        validationSchema: yup.object({
            phone: yup.string().required().matches(/^\d+$/, 'Phone must only contain numbers').length(11).label('Phone'),
            password: yup.string().required().min(6).label('Password'),
        }),
    });


    const [phone] = defineField('phone');
    const [password] = defineField('password');

    return {
        errors,
        handleSubmit,
        resetForm,
        setErrors,
        phone,
        password
    };
}