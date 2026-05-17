// FormCheckbox.tsx - control verzia
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type FormCheckboxProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
};

function FormCheckbox<T extends FieldValues>({
  label,
  name,
  control,
  disabled,
}: FormCheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            checked={field.value === true}
            disabled={disabled}
          />
        }
        label={label}
      />
      {error && (
        <p
          style={{
            color: "#d32f2f",
            fontSize: "0.75rem",
            margin: "3px 14px 0",
          }}
        >
          {error.message}
        </p>
      )}
    </>
  );
}

export default FormCheckbox;
