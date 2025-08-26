import { useForm } from "vee-validate";
import * as yup from "yup";

export function useUpdateProfileForm(initialValues?: {
  name?: string;
  address?: string;
}) {
  const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: yup.object({
      name: yup
          .string()
          .required()
          .test(
              "no-only-space",
              "Name cannot be empty or only spaces",
              value => !!value && value.trim().length > 0
          )
          .matches(/^[a-zA-ZÀ-ÿ\s]*$/, "Name can only contain letters and spaces")
          .min(2)
          .max(50)
          .label("Full Name"),
      address: yup
          .string()
          .required()
          .test(
              "not-empty",
              "Address cannot be empty",
              value => !!value && value.trim().length > 0
          )
          .min(1)
          .max(100)
          .label("Address"),
    }),
    initialValues: {
      name: initialValues?.name || "",
      address: initialValues?.address || "",
    },
  });

  const [name, nameAttrs] = defineField("name");
  const [address, addressAttrs] = defineField("address");

  return {
    errors,
    handleSubmit,
    resetForm,
    name,
    nameAttrs,
    address,
    addressAttrs,
  };
}