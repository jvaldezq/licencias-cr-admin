import * as yup from 'yup';

export const formValidator = (schema: yup.ObjectSchema<any>) => async (values: Record<string, any>) => {
    try {
        await schema.validate(values, { abortEarly: false });
        return {};
    } catch (err: any) {
        return err.inner.reduce((formErrors: any, innerError: any) => {
            const path = innerError.path;
            formErrors[path] = innerError.message;
            return formErrors;
        }, {});
    }
};
