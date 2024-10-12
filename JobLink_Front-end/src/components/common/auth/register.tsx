

import { RegisterSchema } from "@/types/Data/schemas";
import { RegisterFormType } from "@/types/Data/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";

import { useCallback } from "react";

export const RegisterComponent = () => {
  
  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Register</div>

      {/* <Formik
        // initialValues={initialValues}
        validationSchema={RegisterSchema}
        // onSubmit={handleRegister}>
        // {({ values, errors, touched, handleChange, handleSubmit }) => (
           */}
            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='Name'
                // value={values.name}
                // isInvalid={!!errors.name && !!touched.name}
                // errorMessage={errors.name}
                // onChange={handleChange("name")}
              />
              <Input
                variant='bordered'
                label='Email'
                type='email'
                // value={values.email}
                // isInvalid={!!errors.email && !!touched.email}
                // errorMessage={errors.email}
                // onChange={handleChange("email")}
              />
              <Input
                variant='bordered'
                label='Password'
                type='password'
                // value={values.password}
                // isInvalid={!!errors.password && !!touched.password}
                // errorMessage={errors.password}
                // onChange={handleChange("password")}
              />
              <Input
                variant='bordered'
                label='Confirm password'
                type='password'
                // value={values.confirmPassword}
                // isInvalid={
                //   !!errors.confirmPassword && !!touched.confirmPassword
                // }
                // errorMessage={errors.confirmPassword}
                // onChange={handleChange("confirmPassword")}
              />
            </div>

            <Button
             // onPress={() => handleSubmit()}
              variant='flat'
              color='primary'>
              Register
            </Button>
         
        {/* // )}
      </Formik> */}

      <div className='font-light text-slate-400 mt-4 text-sm'>
        Already have an account ?{" "}
        <a href='/login' className='font-bold'>
          Login here
        </a>
      </div>
    </>
  );
};
