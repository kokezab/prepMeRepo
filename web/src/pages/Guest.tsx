import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { enableGuestMode } from '@/redux/uiSlice';

export default function Guest() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(enableGuestMode());
    navigate('/questions', { replace: true });
  }, [dispatch, navigate]);

  return null;
}
