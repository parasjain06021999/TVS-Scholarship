'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect, FormTextarea } from '../../ui/FormInput';

const AcademicInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  const courseOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Science', label: 'Science' },
    { value: 'Law', label: 'Law' },
    { value: 'Management', label: 'Management' },
    { value: 'Other', label: 'Other' },
  ];

  const yearOptions = [
    { value: '1st', label: '1st Year' },
    { value: '2nd', label: '2nd Year' },
    { value: '3rd', label: '3rd Year' },
    { value: '4th', label: '4th Year' },
    { value: '5th', label: '5th Year' },
    { value: 'Post Graduate', label: 'Post Graduate' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
        <p className="mt-2 text-gray-600">Please provide your educational background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          {...register('academicInfo.courseOfStudy')}
          name="academicInfo.courseOfStudy"
          label="Course of Study"
          required
          options={courseOptions}
          error={(errors.academicInfo as any)?.courseOfStudy?.message}
          touched={!!(errors.academicInfo as any)?.courseOfStudy}
        />

        <FormSelect
          {...register('academicInfo.currentYear')}
          name="academicInfo.currentYear"
          label="Current Year"
          required
          options={yearOptions}
          error={(errors.academicInfo as any)?.currentYear?.message}
          touched={!!(errors.academicInfo as any)?.currentYear}
        />

        <FormInput
          {...register('academicInfo.universityName')}
          name="academicInfo.universityName"
          label="University Name"
          required
          error={(errors.academicInfo as any)?.universityName?.message}
          touched={!!(errors.academicInfo as any)?.universityName}
        />

        <FormInput
          {...register('academicInfo.collegeName')}
          name="academicInfo.collegeName"
          label="College Name"
          required
          error={(errors.academicInfo as any)?.collegeName?.message}
          touched={!!(errors.academicInfo as any)?.collegeName}
        />

        <FormInput
          {...register('academicInfo.academicPercentage', { valueAsNumber: true })}
          name="academicInfo.academicPercentage"
          label="Academic Percentage"
          type="number"
          min="0"
          max="100"
          step="0.01"
          required
          error={(errors.academicInfo as any)?.academicPercentage?.message}
          touched={!!(errors.academicInfo as any)?.academicPercentage}
        />
      </div>

      <div className="space-y-4">
        <FormTextarea
          {...register('academicInfo.achievements')}
          name="academicInfo.achievements"
          label="Academic Achievements"
          rows={3}
          placeholder="List your academic achievements, awards, scholarships, etc."
          error={(errors.academicInfo as any)?.achievements?.message}
          touched={!!(errors.academicInfo as any)?.achievements}
        />

        <FormTextarea
          {...register('academicInfo.extraCurriculars')}
          name="academicInfo.extraCurriculars"
          label="Extra-curricular Activities"
          rows={3}
          placeholder="List your extra-curricular activities, sports, clubs, etc."
          error={(errors.academicInfo as any)?.extraCurriculars?.message}
          touched={!!(errors.academicInfo as any)?.extraCurriculars}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Academic Requirements
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Academic percentage should be based on your latest examination results</li>
                <li>Include all relevant academic achievements and awards</li>
                <li>Extra-curricular activities help in holistic evaluation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoStep;
