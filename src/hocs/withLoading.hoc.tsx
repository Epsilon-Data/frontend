import React, { Suspense, useEffect, useState, startTransition } from 'react';
import { Loading } from '@app/components/common/Loading/Loading';

type ReturnType<T> = (props: T) => JSX.Element;

export const withLoading = <T extends object>(Component: React.ComponentType<T>): ReturnType<T> => {
  const Wrapped = (props: T): JSX.Element => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      startTransition(() => {
        setShouldRender(true);
      });
    }, []);

    if (!shouldRender) {
      return <Loading />;
    }

    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };

  return Wrapped;
};
