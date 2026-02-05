interface StatusIndicatorProps {
  status: 'valid' | 'invalid' | 'pending';
  message?: string;
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const configs = {
    valid: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500',
      text: 'text-green-800',
      defaultMessage: 'Signature is valid',
    },
    invalid: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      text: 'text-red-800',
      defaultMessage: 'Signature is invalid',
    },
    pending: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-400',
      text: 'text-gray-600',
      defaultMessage: 'Waiting for verification',
    },
  };

  const config = configs[status];

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${config.bg} ${config.border}`}
    >
      <div className={config.icon}>
        {status === 'valid' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {status === 'invalid' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {status === 'pending' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <span className={`font-medium ${config.text}`}>{message || config.defaultMessage}</span>
    </div>
  );
}
