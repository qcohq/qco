import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

export function useFormField<T extends Record<string, any>>() {
  const { setValue, watch } = useFormContext<T>();

  const handleFieldChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValue(field, value, { shouldDirty: true, shouldValidate: true });
    },
    [setValue],
  );

  const getFieldValue = useCallback(
    <K extends keyof T>(field: K): T[K] => {
      return watch(field);
    },
    [watch],
  );

  const handleNumberFieldChange = useCallback(
    <K extends keyof T>(field: K) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          e.target.value === "" ? undefined : Number(e.target.value);
        handleFieldChange(field, value as T[K]);
      };
    },
    [handleFieldChange],
  );

  const handleStringFieldChange = useCallback(
    <K extends keyof T>(field: K) => {
      return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        handleFieldChange(field, value as T[K]);
      };
    },
    [handleFieldChange],
  );

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => {
      return {
        value: getFieldValue(field) ?? "",
        onChange: handleStringFieldChange(field),
      };
    },
    [getFieldValue, handleStringFieldChange],
  );

  const getNumberFieldProps = useCallback(
    <K extends keyof T>(field: K) => {
      return {
        value: getFieldValue(field) ?? "",
        onChange: handleNumberFieldChange(field),
      };
    },
    [getFieldValue, handleNumberFieldChange],
  );

  return {
    handleFieldChange,
    getFieldValue,
    handleNumberFieldChange,
    handleStringFieldChange,
    getFieldProps,
    getNumberFieldProps,
  };
}
