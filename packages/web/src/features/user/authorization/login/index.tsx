import {
  LoginCard,
  LoginContainer,
  LoginEmailInput,
  LoginPasswordInput,
  LoginSubmitButton,
} from "@/features/user/authorization/login/style";
import { useAuthMutation } from "@/store/user";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [auth, authState] = useAuthMutation();
  const navigate = useNavigate();
  const { values, submitForm, setFieldValue } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      auth({
        providerArgs: { identifier: values.email, password: values.password },
      });
    },
  });
  useEffect(() => {
    if (authState.data) {
      navigate("/cabinet");
    }
  }, [authState.data]);
  return (
    <LoginContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
        <LoginCard>
          <LoginEmailInput
            value={values.email}
            onChange={({ target: { value } }) => setFieldValue("email", value)}
          />
          <LoginPasswordInput
            type={"password"}
            value={values.password}
            onChange={({ target: { value } }) =>
              setFieldValue("password", value)
            }
          />
          <LoginSubmitButton type={"submit"} disabled={authState.isLoading}>
            Войти
          </LoginSubmitButton>
        </LoginCard>
      </form>
    </LoginContainer>
  );
};
