import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';

// Generic async action hook
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError('');
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, run };
}

// Form state hook
export function useForm(initial) {
  const [values, setValues] = useState(initial);

  const set = useCallback((key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  return { values, set, handleChange, reset, setValues };
}

// Toggle hook
export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState((s) => !s), []);
  const open   = useCallback(() => setState(true), []);
  const close  = useCallback(() => setState(false), []);
  return [state, { toggle, open, close }];
}
