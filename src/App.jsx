import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import { Suspense } from 'react';

// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from './pages/Home';
// import { loader as postLoader } from './pages/Post';
import RootLayout from './pages/Root';

// import('./pages/Blog') function itself returns a Promise
const BlogPage = lazy(() => import('./pages/Blog'));
const PostPage = lazy(() => import('./pages/Post'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts',
        children: [
          {
            index: true,
            element: (
              // ! until the code os there we show this Loading... fallback
              <Suspense fallback={<p>Loading...</p>}>
                <BlogPage />
              </Suspense>
            ),
            // ! this loader will be lazylly loaded
            loader: () => import('./pages/Blog').then((module) => module.loader()),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <PostPage />
              </Suspense>
            ),
            loader: ({ params }) => import('./pages/Post').then((module) => module.loader({ params })),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
