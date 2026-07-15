import { useEffect, useState } from 'react';

interface Props {
  startedAt: string | null;
  durationSeconds: number;
  queued?: boolean;
}

export const BuildingProgressBar = ({ startedAt, durationSeconds, queued }: Props) => {
  const getProgress = () => {
    if (!startedAt) return 0;
    const elapsed = (Date.now() - new Date(startedAt + 'Z').getTime()) / 1000;
    return Math.min(elapsed / durationSeconds, 1);
  };

  const [progress, setProgress] = useState(getProgress);

  useEffect(() => {
    if (queued) return;
    const id = setInterval(() => setProgress(getProgress()), 1000);
    return () => clearInterval(id);
  }, [startedAt, durationSeconds, queued]);

  if (queued) {
    return (
      <div className='construction-progress'>
        <div className='construction-progress-bar construction-progress-bar--queued'>
          <div className='construction-progress-queue-dots' />
        </div>
        <span className='construction-progress-label'>Queued</span>
      </div>
    );
  }

  const remaining = Math.max(0, durationSeconds - (Date.now() - new Date((startedAt ?? '') + 'Z').getTime()) / 1000);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  const label = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div className='construction-progress'>
      <div className='construction-progress-bar'>
        <div className='construction-progress-fill' style={{ width: `${progress * 100}%` }} />
      </div>
      <span className='construction-progress-label'>{label}</span>
    </div>
  );
};
