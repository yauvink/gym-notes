import { toast } from 'sonner';

export function notifyShort(message: string) {
  toast.success(message, {
    duration: 1800,
    className: 'gn-toast gn-toast--short',
  });
}

export function notifyPending(message: string, description?: string) {
  return toast.loading(message, {
    description,
    className: 'gn-toast gn-toast--large',
  });
}

export function notifyLarge(message: string, description?: string, id?: string | number) {
  toast.success(message, {
    id,
    description,
    duration: 5000,
    className: 'gn-toast gn-toast--large',
  });
}

export function notifyError(message: string, description?: string, id?: string | number) {
  toast.error(message, {
    id,
    description,
    duration: 5500,
    className: 'gn-toast gn-toast--large',
  });
}
