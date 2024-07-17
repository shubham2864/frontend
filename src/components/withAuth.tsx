// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import jwt_decode, { jwtDecode } from 'jwt-decode';

// const useAuth = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken: any = jwtDecode(token);
//         const currentTime = Date.now() / 1000;

//         if (decodedToken.exp < currentTime) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('userName');
//           router.push('/login');
//         }
//       } catch (error) {
//         console.error('Failed to decode token:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('userName');
//         router.push('/login');
//       }
//     } else {
//       router.push('/login');
//     }
//   }, [router]);
// };

// export default useAuth;
