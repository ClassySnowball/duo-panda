'use client';

import { useState, useEffect } from 'react';
import {
  getExistingSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  serializeSubscription,
} from '@/lib/notifications';
import { saveSubscription, deleteSubscription } from '@/app/actions/notifications';

export default function NotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const hasPush = 'serviceWorker' in navigator && 'PushManager' in window;
    setSupported(hasPush);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    if (hasPush) {
      getExistingSubscription().then((sub) => {
        setSubscribed(!!sub);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    if (subscribed) {
      const sub = await getExistingSubscription();
      if (sub) {
        await deleteSubscription(sub.endpoint);
        await unsubscribeFromPush();
      }
      setSubscribed(false);
    } else {
      const sub = await subscribeToPush();
      if (sub) {
        await saveSubscription(serializeSubscription(sub));
        setSubscribed(true);
      }
    }
    setLoading(false);
  };

  if (!supported) {
    if (isIOS && !isStandalone) {
      return (
        <div className="bg-trail-50 rounded-xl p-4 text-sm text-trail-500">
          <p className="font-medium text-trail-600 mb-1">Enable notifications</p>
          <p>To receive push notifications on iOS, add Duo Panda to your Home Screen first: tap the share button, then &quot;Add to Home Screen&quot;.</p>
        </div>
      );
    }
    return (
      <p className="text-sm text-trail-400">Push notifications are not supported in this browser.</p>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-trail-600">Push notifications</p>
        <p className="text-xs text-trail-400">Daily reminders & streak alerts</p>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative w-12 h-7 rounded-full transition-colors disabled:opacity-50 ${
          subscribed ? 'bg-forest-500' : 'bg-trail-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
            subscribed ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
