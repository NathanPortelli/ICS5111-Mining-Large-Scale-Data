import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from './firebase';

const withAuth = (WrappedComponent) => {
    const WithAuth = (props) => {
      const router = useRouter();
  
      useEffect(() => {
        const checkAuth = async () => {
          if (!auth.currentUser) {
            // If user is not logged in, redirect to the credentials page
            router.replace('/credentials');
          }
        };
  
        checkAuth();
      }, []);
  
      return <WrappedComponent {...props} />;
    };
  
    // Display name for the HOC
    WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
    return WithAuth;
  };
  
  export default withAuth;