import * as yup from 'yup';

export const formValidator = <T extends yup.AnyObjectSchema>(schema: T) => async (values: yup.InferType<T>) => {
    try {
        await schema.validate(values, {abortEarly: false});
        return {};
    } catch (err: unknown) {
        if (err instanceof yup.ValidationError) {
            return err.inner.reduce((formErrors: Record<string, string>, innerError) => {
                if (innerError.path) {
                    formErrors[innerError.path] = innerError.message;
                }
                return formErrors;
            }, {});
        }
        throw err;
    }
};
