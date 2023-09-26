import { useNavigate, useRouteError } from "react-router-dom";
import { CustomButton } from "../../components/forms";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);
  return (
    <div className={`flex h-screen flex-col items-center justify-center`}>
      <h1 className="mb-2 text-2xl font-semibold">Oops!</h1>
      <p className="mb-8">Sorry, an unexpected error has occurred.</p>
      <div
        className={`flex items-center justify-center text-center text-skin-base`}
      >
        <div
          className={`mr-4 border-r border-skin-inverted text-4xl font-semibold text-skin-inverted`}
        >
          <p className={`mr-4`}>{error?.status}</p>
        </div>

        <p>{error?.statusText || error?.message}</p>
      </div>

      <div className="my-4 w-36" onClick={() => navigate(-1)}>
        <CustomButton name="Go back" className="h-11" />
      </div>
    </div>
  );
};

export default ErrorPage;
