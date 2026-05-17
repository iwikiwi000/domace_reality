import type { FieldError, FieldValues, UseFormRegister } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

type FormInputProps<T extends FieldValues> = {
  label: string;
  name: any;
  type: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
};

function FormInput<T extends FieldValues>({
  label,
  name,
  type,
  register,
  error,
  required = false,
  placeholder,
  multiline = false,
  rows = 4,
  disabled = false,
  fullWidth = true,
  onBlur,
  onFocus,
}: FormInputProps<T>) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        {...register(name)}
        label={label}
        type={type}
        placeholder={placeholder}
        error={!!error}
        helperText={error?.message}
        required={required}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        disabled={disabled}
        fullWidth={fullWidth}
        variant="outlined"
        size="medium"
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </Box>
  );
}

export default FormInput;
