/**
 * Web application main component
 */

import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { StoryType } from './utils/types';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Layout toggleMobileMenu={toggleMobileMenu} mobileMenuOpen={mobileMenuOpen}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/stories/:type">
          {params => <StoriesPage type={params.type as StoryType} />}
        </Route>
        <Route path="/story/:id">
          {params => <StoryDetailPage id={parseInt(params.id, 10)} />}
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  );
}