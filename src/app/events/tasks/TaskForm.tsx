'use client';

import { Field, FormRenderProps, SupportedInputs } from 'react-final-form';
import * as React from 'react';
import { ITaskForm } from '@/app/events/tasks/CreateTask';
import { FormTextarea } from '@/components/Forms/Textarea/FormTextarea';
import { FormDropdown } from '@/components/Forms/Dropdown/FormDropdown';
import { FormCalendar } from '@/components/Forms/Calendar/FormCalendar';
import { FormInput } from '@/components/Forms/Input/FormInput';
import {
  useGetInstructorList,
  useGetLocationList,
} from '@/app/events/services/client';

export type TaskFormProps = FormRenderProps<ITaskForm> & {};

export const TaskForm = (props: TaskFormProps) => {
  const { handleSubmit } = props;
  const { data: locations, isLoading: isLocationsLoading } =
    useGetLocationList();
  const { data: instructors } = useGetInstructorList();

  return (
    <form
      id="task-form"
      onSubmit={handleSubmit}
      className="grid md:grid-cols-2 gap-6"
    >
      <Field
        name="title"
        component={FormInput as unknown as SupportedInputs}
        placeholder="Título"
        label="Título"
        required
      />

      <Field
        component={FormCalendar as unknown as SupportedInputs}
        placeholder="Fecha"
        label="Fecha"
        name="date"
        required
      />

      <Field
        name="locationId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Sede"
        label="Sede"
        options={locations || []}
        isLoading={isLocationsLoading}
        required
      />

      <Field
        name="assignedToId"
        component={FormDropdown as unknown as SupportedInputs}
        placeholder="Asignado a"
        label="Asignado a"
        options={instructors || []}
      />

      <Field
        name="notes"
        component={FormTextarea as unknown as SupportedInputs}
        placeholder="Comentarios"
        label="Comentarios"
        wrapperClassName="md:col-span-2"
      />
    </form>
  );
};
