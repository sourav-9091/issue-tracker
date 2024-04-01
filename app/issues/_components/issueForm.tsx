"use client"

import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import "easymde/dist/easymde.min.css"
import { useForm, Controller, set } from 'react-hook-form'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IssueSchema } from "@/app/validationSchema";
import { z } from 'zod';
import ErrorMessage from '@/app/components/errorMessage';
import Spinner from '@/app/components/spinner';
import { Issue } from '@prisma/client';
import SimpleMDE from 'react-simplemde-editor';

type IssueFormData = z.infer<typeof IssueSchema>;

interface Props {
  issue?: Issue
}

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(IssueSchema)
  });
  return (
    <div className='max-w-xl '>
      {error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>}
      <form className='space-y-3' onSubmit={handleSubmit(async (data) => {
        try {
          setIsSubmitting(true);
          if (issue) {
            axios.patch(`/api/issues/${issue.id}`, data);
          } else {
            await axios.post('/api/issues', data);
          }
          router.push('/issues');
        } catch (error) {
          setIsSubmitting(false);
          setError('An Unexpected Error Occurred. Please Try Again Later.');
        }

      })}>
        <TextField.Root defaultValue={issue?.title} placeholder="Title" {...register('title')}>
        </TextField.Root>
        {errors.title && <ErrorMessage>{errors.title?.message}</ErrorMessage>}
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
        />
        {errors.description && <ErrorMessage>{errors.description?.message}</ErrorMessage>}
        <Button disabled={isSubmitting}>{issue ? 'Update Issue ' : 'Submit New Issue'}{ ' ' }{isSubmitting && <Spinner />}</Button>
      </form>
    </div>
  )
}

export default IssueForm;