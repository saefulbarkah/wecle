import Input from '@/components/form/Input';
import { Button } from '@/components/ui/button';
import SwitchMenuAuth from './switch-menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, loginType } from '@/schemas/login-schema';

const LoginOverlay = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<loginType>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async () => {
    console.log('testing');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-10">Sign In</h2>
      <form
        action=""
        className="w-full sm:px-16"
        onSubmit={handleSubmit(onLogin)}
      >
        <div className="flex flex-col gap-10">
          <Input.Text
            {...register('email')}
            error={errors.email}
            placeholder="Email"
          />
          <Input.Password
            placeholder="Password"
            error={errors.password}
            {...register('password')}
          />
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <p className="mt-2 text-sm">
        <span>Dont have account ? </span>
        <SwitchMenuAuth />
      </p>
    </div>
  );
};

export default LoginOverlay;