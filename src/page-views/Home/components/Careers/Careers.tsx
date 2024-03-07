'use client';

import { lazy, useState } from 'react';
import { Job, jobs } from './data';
const Modal = lazy(() => import('./JobModal'));

export function Careers() {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  return (
    <div>
      <h2 className="text-center text-[22px] sm:text-3xl mb-16 font-semibold">
        {' '}
        We are hiring{' '}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8  text-start leading-5">
        {jobs.map((job, index) => (
          <li
            key={index}
            className="card rounded-full px-7 h-14 flex items-center"
            onClick={() => {
              setActiveJob(job);
            }}
          >
            {job.title} {'->'}
          </li>
        ))}
      </ul>
      {activeJob && (
        <Modal
          onClose={() => {
            setActiveJob(null);
          }}
          {...activeJob}
        />
      )}
    </div>
  );
}
