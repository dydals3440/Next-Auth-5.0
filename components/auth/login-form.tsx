import { CardWrapper } from './card-wrapper';

// page가 아니고 component이기 떄문에 export default 안함!
export const LoginForm = () => {
  return (
    <>
      <CardWrapper
        headerLabel='Welcome back'
        backButtonLabel="Don't hav an account?"
        backButtonHref='/auth/register'
        showSocial
      >
        Login Form!
      </CardWrapper>
    </>
  );
};
