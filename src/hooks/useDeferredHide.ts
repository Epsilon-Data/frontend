import * as React from 'react';

export function useDeferredHide(hidden: boolean) {
  const [effectiveHidden, setEffectiveHidden] = React.useState(false);

  React.useEffect(() => {
    if (!hidden) {
      setEffectiveHidden(false);
      return;
    }
    const id = requestAnimationFrame(() => setEffectiveHidden(true));
    return () => cancelAnimationFrame(id);
  }, [hidden]);

  return effectiveHidden;
}
