import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import StoriesPage from "@/pages/StoriesPage";
import StoryDetailPage from "@/pages/StoryDetailPage";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/lib/userContext";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/stories/:type" component={StoriesPage} />
          <Route path="/item/:id" component={StoryDetailPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </Layout>
    </AuthProvider>
  );
}

export default App;
