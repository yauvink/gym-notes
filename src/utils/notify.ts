import { toast } from 'sonner';

export function notifyShort(message: string) {
  toast.success(message, {
    duration: 1800,
    className: 'gn-toast gn-toast--short',
  });
}

export function notifyLarge(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 5000,
    className: 'gn-toast gn-toast--large',
  });
}

export function notifyError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 5500,
    className: 'gn-toast gn-toast--large',
  });
}
