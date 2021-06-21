import { setAuthTokens } from './../../../services/axios-jwt';
import { useMutation, useQueryClient } from 'react-query';
import { login, LoginDto } from './../../../services/auth';

export const useLoginMutation = () => {
  const qc = useQueryClient();
  return useMutation((loginDto: LoginDto) => login(loginDto), {
    onSuccess: (tokens) => {
      setAuthTokens(tokens);

      qc.invalidateQueries('whoami');
    },
  });
};
