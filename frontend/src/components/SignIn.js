import React from "react";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup"

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Too Short').max(50, 'Too Long').required('required'),
  email: Yup.string.email('Invalid email id').required('required'),
  password: Yup.string.min(6, 'Too short').max(10, 'Too Long').required('required'),
  phone: Yup.number.min(6, 'Too Short').max(10, 'Too Long').required('required'),
  role: Yup.string,
  
})

