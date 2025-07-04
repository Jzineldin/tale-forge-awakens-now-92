import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthProvider';
import { HeaderVisibilityProvider } from '@/context/HeaderVisibilityContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import CreateStory from '@/pages/CreateStory';
import StoryViewer from '@/pages/StoryViewer';
import MyStories from '@/pages/MyStories';
import PublicStories from '@/pages/PublicStories';
import GenreSelection from '@/pages/GenreSelection';
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
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/create/genre" element={<GenreSelection />} />
                  <Route path="/create-story" element={<CreateStory />} />
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
