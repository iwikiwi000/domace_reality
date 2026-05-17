// FormSelect.tsx (opravený)
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

type FormSelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

function FormSelect<T extends FieldValues>({
  label,
  name,
  control,
  options,
  required,
  disabled,
  fullWidth = true,
}: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <TextField
      {...field}
      select
      label={label}
      error={!!error}
      helperText={error?.message}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      variant="outlined"
      size="medium"
      sx={{ mb: 2 }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default FormSelect;
