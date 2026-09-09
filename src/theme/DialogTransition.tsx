import { forwardRef, ReactElement, Ref } from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const DialogSlideUp = forwardRef(function DialogSlideUp(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} timeout={280} />;
});

export default DialogSlideUp;
