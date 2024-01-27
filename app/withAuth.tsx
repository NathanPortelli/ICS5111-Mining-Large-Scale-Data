import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useLocalStorage } from "./hooks/localStorage";

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const { get, set } = useLocalStorage();

    useEffect(() => {
      if (get("userId")) {
        return;
      }
      
      auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
          router.push("/credentials");
        }
        set("userId", JSON.stringify(authUser!.uid));
      });
    }, [router, get, set]);

    return <WrappedComponent {...props} />;
  };

  // Display name for the HOC
  WithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
