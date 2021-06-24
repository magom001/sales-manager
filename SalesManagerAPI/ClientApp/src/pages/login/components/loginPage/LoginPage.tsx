import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { LoginDto } from '../../../../services/auth';
import { useLoginMutation } from '../../hooks';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const mutation = useLoginMutation();
  const { register, handleSubmit, formState } = useForm<LoginDto>();

  const onSubmit = useCallback(
    (data: LoginDto) => {
      mutation.mutate(data);
    },
    [mutation],
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            {...register('username', { required: "Username is required" })}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
            autoComplete="off"
            error={Boolean(formState.errors['username'])}
            helperText={formState.errors['username']?.message}
          />
          <TextField
            {...register('password', { required: "Password is required" })}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            error={Boolean(formState.errors['password'])}
            helperText={formState.errors['password']?.message}
          />
          <Button
            disabled={mutation.isLoading}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default React.memo(LoginPage);
