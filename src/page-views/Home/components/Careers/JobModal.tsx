import { Modal } from '@/Components/Modal';
import { Job } from './data';
import { JobDescription } from './JobDescription';

type JobModalProps = Job & {
  onClose: () => void;
};

export default function JobModal({ onClose, ...jd }: JobModalProps) {
  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      className=" rounded-18"
      containerClassName="!card overflow-auto w-[1000px] max-h-full sm:max-h-[90vh] max-w-[98vw]"
    >
      <JobDescription {...jd} />
    </Modal>
  );
}
