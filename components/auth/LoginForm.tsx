import CardParent from './CardParent';

export default function LoginForm() {
  return (
    <CardParent
      title="Login"
      returnLabel="Create an account"
      returnHref="/auth/register"
      showSocials
    >
      <span>LoginForm</span>
    </CardParent>
  );
}
