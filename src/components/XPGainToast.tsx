'use client';

import { useEffect, useState } from 'react';

interface XPGainToastProps {
  xp: number;
}

export default function XPGainToast({ xp }: XPGainToastProps) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (xp > 0) {
      setKey(k => k + 1);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [xp]);

  if (!visible) return null;

  return (
    <span
      key={key}
      className="absolute top-3 right-12 text-forest-500 font-bold text-sm animate-xp-toast pointer-events-none"
    >
      +{xp} XP
    </span>
  );
}
