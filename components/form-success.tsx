// shadcn에서 newyork 스타일을 고르면 아래있는게 생김!
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500'>
      <CheckCircledIcon className='w-4 h-4' />
      <p>{message}</p>
    </div>
  );
};
