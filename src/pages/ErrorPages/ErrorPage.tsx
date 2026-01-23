import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '@app/context/Error';
import { ApiErrorData } from '@app/api/ApiError';
import ErrorImg from '@app/assets/error.png';
import { useTranslation } from 'react-i18next';

const ErrorPage: React.FC = () => {
  const { error, clearError } = useError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-8 md:px-10">
      <div className="w-full max-w-5xl">
        <div className="grid items-center gap-8 md:grid-cols-2 mt-10">
          <div className="text-left">
            <h1 className="mt-2 text-3xl font-semibold">{'Oops!'}</h1>

            <p className="mt-3 text-base text-gray-700">{t('error.somethingWentWrong')}</p>
            <div className="text-sm text-gray-500">{t('error.actionNotCompleted')}</div>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => {
                  clearError();
                  navigate(-1);
                }}
              >
                {t('common.back')}
              </button>

              <button
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
                onClick={() => {
                  clearError();
                  navigate('/');
                }}
              >
                {t('error.goToDashboard')}
              </button>
            </div>

            {(error?.data as ApiErrorData) && (
              <details className="mt-6 text-sm text-gray-600">
                <summary className="cursor-pointer">Technical details</summary>
                <pre className="mt-2 max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
                  {JSON.stringify(error?.data, null, 2)}
                </pre>
              </details>
            )}

            <div className="mt-6 text-sm text-gray-500">
              If this keeps happening, it may be a permissions issue (e.g. 403) or a temporary server error.
            </div>
          </div>
          <div className="hidden md:flex md:justify-end">
            <img
              src={ErrorImg}
              alt="Error illustration"
              className="h-auto w-full max-w-md select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
