import { useState } from 'react';
import { LayoutDashboard, Cpu, Upload, BrainCircuit } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Overview } from '@/views/Overview';
import { Simulator } from '@/views/Simulator';
import { DatasetUpload } from '@/views/DatasetUpload';
import { ModelInsights } from '@/views/ModelInsights';
import type { ViewId } from '@/types';

const VIEW_META: Record<ViewId, { title: string; subtitle: string; icon: React.ReactNode }> = {
  overview: {
    title: 'Overview Dashboard',
    subtitle: 'Model performance and transaction monitoring',
    icon: <LayoutDashboard size={22} />,
  },
  simulator: {
    title: 'Transaction Simulator',
    subtitle: 'Interactive SPDF fraud risk analysis',
    icon: <Cpu size={22} />,
  },
  dataset: {
    title: 'Batch Evaluation',
    subtitle: 'Upload and evaluate custom datasets',
    icon: <Upload size={22} />,
  },
  insights: {
    title: 'Model Insights',
    subtitle: 'SPDF decision boundary and architecture',
    icon: <BrainCircuit size={22} />,
  },
};

function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const meta = VIEW_META[activeView];

  return (
    <div className="min-h-screen bg-ink-950 text-ink-200 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 min-w-0">
        <TopBar title={meta.title} subtitle={meta.subtitle} icon={meta.icon} />
        <div key={activeView}>
          {activeView === 'overview' && <Overview onNavigate={setActiveView} />}
          {activeView === 'simulator' && <Simulator />}
          {activeView === 'dataset' && <DatasetUpload />}
          {activeView === 'insights' && <ModelInsights />}
        </div>
      </main>
    </div>
  );
}

export default App;
