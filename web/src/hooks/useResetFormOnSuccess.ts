import {useEffect} from "react";
import type {FormInstance} from "antd";

/**
 * Resets Ant Design form fields when a mutation succeeds.
 * @param form The Ant Design form instance
 * @param isSuccess Whether the related async action succeeded
 * @param fields Optional list of field names to reset; if omitted, all fields are reset
 */
type ResetFieldsArg<T extends object> = Parameters<FormInstance<T>["resetFields"]>[0];

export default function useResetFormOnSuccess<T extends object = any>(
  form: FormInstance<T>,
  isSuccess: boolean,
  fields?: ResetFieldsArg<T>
) {
  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(fields) && fields.length) {
        form.resetFields(fields);
      } else {
        form.resetFields();
      }
    }
  }, [isSuccess, form, JSON.stringify(fields)]);
}
