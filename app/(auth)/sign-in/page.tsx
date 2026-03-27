import AuthForm from "@/components/AuthForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const SignIn = () => {
  // const loggedInUser = await getLoggedInUser();

  // console.log("Logged in user:", loggedInUser);
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
