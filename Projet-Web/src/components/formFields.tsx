// components/FormField.tsx
import { Component } from "solid-js";

type FormFieldProps = {
  label: string;
  name: string;
  id: string;
  type: "text" | "number" | "date" | "file" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

const FormField: Component<FormFieldProps> = (props) => {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-white">{props.label}</label>
      {props.type === "select" ? (
        <select
          name={props.name}
          id={props.id}
          required={props.required}
          class="w-full p-2 rounded bg-white text-blue-900"
        >
          {props.options?.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={props.type}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          required={props.required}
          class="w-full p-2 rounded bg-white text-blue-900"
        />
      )}
    </div>
  );
};

export default FormField;
