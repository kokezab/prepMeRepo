export default function GoogleLoginButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="google-login-btn">
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
      />
      <span>Sign in with Google</span>
    </button>
  );
}