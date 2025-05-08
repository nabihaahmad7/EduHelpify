"use client";
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';
import Form from './Forms';

export default function MainContent() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <Form />
  );
}