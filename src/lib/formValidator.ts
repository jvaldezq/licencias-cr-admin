import * as yup from 'yup';

export const formValidator = (schema: yup.ObjectSchema<any>) => async (values: Record<string, any>) => {
    try {
        await schema.validate(values, { abortEarly: false });
    } catch (err: any) {
        return err.inner.reduce((formErrors: any, innerError: any) => {
            formErrors[innerError.path] = innerError.message;
            return formErrors;
        }, {});
    }
};
