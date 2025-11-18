import { InsightsWelcome } from './insights-welcome';
import FavoritesDashboard from './components/FavoritesDashboard';
import '../styles.css';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <InsightsWelcome />
          <FavoritesDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
