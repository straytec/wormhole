import React from 'react';
import { Layout } from '../../../components/Layout';
import { UniverseCanvas } from '../components/UniverseCanvas';
import { AddContentFlow } from '../../content/components/AddContentFlow';
import { useUniverseStore } from '../../../stores/universe';

export const UniversePage: React.FC = () => {
  const { isAddingContent } = useUniverseStore();

  return (
    <Layout>
      <UniverseCanvas />
      {isAddingContent && <AddContentFlow />}
    </Layout>
  );
};