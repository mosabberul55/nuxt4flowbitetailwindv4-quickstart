import { useForm } from "vee-validate";
import * as yup from "yup";

export function useRegisterForm() {
  const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
    validationSchema: yup.object({
      name: yup
          .string()
          .required()
          .matches(/^[^\s][\w\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*(?: [\w\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/, "Name must contain single spaces only between letters")
          .max(20)
          .label("Name"),
      email: yup.string().required().email().label("Email"),
      phone: yup
        .string()
        .required()
        .matches(/^\d+$/, "Mobile must be numbers only")
        .length(11, "Mobile must be 11 digits")
        .label("Mobile"),
      address: yup.string().required().label("Address"),
      password: yup.string().required().min(6).label("Password"),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password")], "Passwords must match")
        .label("Confirm Password"),
      terms: yup
        .string()
        .required("You must accept the terms and conditions")
        .oneOf(["agree"], "You must agree to continue"),
    }),
  });

  const [name] = defineField("name");
  const [email] = defineField("email");
  const [phone] = defineField("phone");
  const [address] = defineField("address");
  const [password] = defineField("password");
  const [confirmPassword] = defineField("confirmPassword");
  const [terms] = defineField("terms");

  return {
    errors,
    handleSubmit,
    resetForm,
    setErrors,
    name,
    email,
    phone,
    address,
    password,
    confirmPassword,
    terms,
  };
}
