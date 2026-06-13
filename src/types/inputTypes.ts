import { FieldErrors, FieldValues, UseFormRegisterReturn} from 'react-hook-form';

export type TouchedFieldsType<TFieldValues extends FieldValues> = {
  [K in keyof TFieldValues]?: boolean;
}

export type CommonProps = {
  label?: string;
  name: string;
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  touchFields?: TouchedFieldsType<FieldValues>
  className?: string;
  id?: string;
  placeholder?: string;
}