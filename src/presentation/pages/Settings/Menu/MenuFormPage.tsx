import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const MenuFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id?: string }>();

  useEffect(() => {
    navigate('/settings/menu' + (editId ? '' : '?action=new'), { replace: true });
  }, [editId, navigate]);

  return null;
};

export default MenuFormPage;
