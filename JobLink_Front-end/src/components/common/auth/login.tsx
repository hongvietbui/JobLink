import { useCallback } from "react";
import { Formik } from "formik";
import { LoginSchema } from "@/types/Data/schemas";
import { LoginFormType } from "@/types/Data/types";
import { Button, Input } from "@nextui-org/react";
export const LoginComponent = () => {
  const initialValues: LoginFormType = {
    email: "admin@acme.com",
    password: "admin",
  };

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>

      {/* <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
       */}
      <>
        <div className="flex flex-col w-1/2 gap-4 mb-4">
          <Input
            variant="bordered"
            label="Email"
            type="email"
            // value={values.email}
            // isInvalid={!!errors.email && !!touched.email}
            // errorMessage={errors.email}
            // onChange={handleChange("email")}
          />
          <Input
            variant="bordered"
            label="Password"
            type="password"
            // value={values.password}
            // isInvalid={!!errors.password && !!touched.password}
            // errorMessage={errors.password}
            // onChange={handleChange("password")}
          />
        </div>

        <Button
          onPress={() => console.log("click")}
          variant="flat"
          color="primary"
        >
          Login
        </Button>
      </>
      {/*       
      </Formik> */}

      <div className="font-light text-slate-400 mt-4 text-sm">
        Don&apos;t have an account ?{" "}
        <a href="/register" className="font-bold">
          Register here
        </a>
      </div>
    </>
  );
};
