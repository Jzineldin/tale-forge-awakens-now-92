
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthProvider';
import { HeaderVisibilityProvider } from '@/context/HeaderVisibilityContext';
import Layout from '@/components/Layout';
import HomePage from '@/components/HomePage';
import Auth from '@/pages/Auth';
import StoryCreation from '@/pages/StoryCreation';
import StoryViewer from '@/pages/StoryViewer';
import MyStories from '@/pages/MyStories';
import PublicStories from '@/pages/PublicStories';
import CreateGenre from '@/pages/CreateGenre';
import StoryMigrationWrapper from '@/components/StoryMigrationWrapper';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoryMigrationWrapper>
            <HeaderVisibilityProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/create/genre" element={<CreateGenre />} />
                  <Route path="/create-story" element={<StoryCreation />} />
                  <Route path="/story/:id" element={<StoryViewer />} />
                  <Route path="/my-stories" element={<MyStories />} />
                  <Route path="/public-stories" element={<PublicStories />} />
                </Routes>
              </Layout>
            </HeaderVisibilityProvider>
          </StoryMigrationWrapper>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </Router>
  );
}

export default App;
