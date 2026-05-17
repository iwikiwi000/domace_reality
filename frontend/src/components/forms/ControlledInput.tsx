// src/components/forms/ControlledInput.tsx
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import TextField from "@mui/material/TextField";

type ControlledInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  onBlur?: () => void;
  onFocus?: () => void;
};

function ControlledInput<T extends FieldValues>({
  label,
  name,
  control,
  type = "text",
  required,
  disabled,
  multiline,
  rows,
  placeholder,
  onBlur,
  onFocus,
}: ControlledInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <TextField
      {...field}
      label={label}
      type={type}
      placeholder={placeholder}
      error={!!error}
      helperText={error?.message}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth
      variant="outlined"
      size="medium"
      sx={{ mb: 2 }}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}

export default ControlledInput;
