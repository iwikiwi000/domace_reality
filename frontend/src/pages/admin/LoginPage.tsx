import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../../components/forms/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axiosInstance from "../../services/axios";
import { useAuth } from "../../context/useAuth";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "../../types/user-role.enum";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email("Neplatný email"),
  password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
    email: z.string().email("Neplatný email"),
    password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
    passwordRepeat: z.string().min(6, "Heslo sa musí zhodovať"),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Heslá sa nezhodujú",
    path: ["passwordRepeat"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login } = useAuth();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await axiosInstance.post<{ access_token: string }>(
        "/auth/login",
        data,
      );

      const token = response.data.access_token;
      const decoded = jwtDecode<{
        userId: string;
        email: string;
        role?: string;
      }>(token);

      const role = (decoded.role as UserRole) || UserRole.USER;
      login(token, {
        userId: decoded.userId,
        email: decoded.email,
        role,
        isAdmin: role === UserRole.ADMIN,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError("Nesprávne prihlasovacie údaje");
      console.log(err);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      const { passwordRepeat, ...registerData } = data;

      await axiosInstance.post("/auth/register", registerData);

      const loginResponse = await axiosInstance.post<{ access_token: string }>(
        "/auth/login",
        {
          email: data.email,
          password: data.password,
        },
      );

      const token = loginResponse.data.access_token;
      const decoded = jwtDecode<{
        userId: string;
        email: string;
        role?: string;
      }>(token);

      const role = (decoded.role as UserRole) || UserRole.USER;
      login(token, {
        userId: decoded.userId,
        email: decoded.email,
        role,
        isAdmin: role === UserRole.ADMIN,
      });

      toast.success("Registrácia bola úspešná!");
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err.response?.data?.message === "Email already exists") {
        setError("Používateľ s týmto emailom už existuje");
      } else {
        setError("Registrácia zlyhala. Skúste to znova.");
      }
      console.log(err);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    resetLogin();
    resetRegister();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {isLoginMode ? (
          <div>
            <h1>Prihlásenie</h1>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <FormInput
                label="Email"
                name="email"
                type="email"
                register={registerLogin}
                error={loginErrors.email}
              />
              <FormInput
                label="Heslo"
                name="password"
                type="password"
                register={registerLogin}
                error={loginErrors.password}
              />
              <button className="styled-button mt-2" type="submit">
                Prihlásiť sa
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1>Registrácia</h1>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
              <FormInput
                label="Meno"
                name="name"
                type="text"
                register={registerRegister}
                error={registerErrors.name}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                register={registerRegister}
                error={registerErrors.email}
              />
              <FormInput
                label="Heslo"
                name="password"
                type="password"
                register={registerRegister}
                error={registerErrors.password}
              />
              <FormInput
                label="Potvrdenie hesla"
                name="passwordRepeat"
                type="password"
                register={registerRegister}
                error={registerErrors.passwordRepeat}
              />
              <button className="styled-button mt-2" type="submit">
                Registrovať sa
              </button>
            </form>
          </div>
        )}
        <p className="form-link" onClick={toggleMode}>
          {isLoginMode
            ? "Nemáte účet? Zaregistrujte sa"
            : "Už máte účet? Prihláste sa"}
        </p>
      </div>
      <div className="auth-image"></div>
    </div>
  );
}

export default LoginPage;
