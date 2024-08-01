'use client'

import axios from 'axios'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Callout, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import {useForm, Controller} from 'react-hook-form'
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '@/app/validationSchema';
import {z} from 'zod'
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof schema>

const NewIssuePage = () => {
  const router = useRouter()
  const {register, control, handleSubmit, formState:{errors}} = useForm<IssueForm>({
  resolver: zodResolver(schema)})
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
  const onSubmit=handleSubmit(async(data)=>{
    try {
     setSubmitting(true)
      await axios.post('/api/issues', data)
      router.push('/issues')
    } catch (error) { 
     setSubmitting(false)
     setError('An unexpected error has occured')
    } 
   })

  return (
    <div className='max-w-xl' >
       {error &&<Callout.Root color='red' className='space-y-3 mb-5'>
      <Callout.Text>
        {error}
      </Callout.Text>
    </Callout.Root>}

    <form className='max-w-xl space-y-3' 
    onSubmit={onSubmit}>

      <TextField.Root placeholder='Title' {...register('title')}>
      </TextField.Root>
         <ErrorMessage>
           {errors.title?.message}
         </ErrorMessage>
      <Controller
       name='description'
       control = {control}
       render={({field})=>
       <SimpleMDE placeholder="Description" {...field}/>}
      />
      <ErrorMessage>
        {errors.description?.message}
      </ErrorMessage>

      <Button disabled={isSubmitting}>
        Submit New Issue{isSubmitting&&<Spinner/>}
      </Button>

    </form>
    </div>
  )
}

export default NewIssuePage
