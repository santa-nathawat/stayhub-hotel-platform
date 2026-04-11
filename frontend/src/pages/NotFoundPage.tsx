import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold text-apple-text mb-4">404</h1>
        <p className="text-lg text-apple-text-secondary mb-6">Page not found</p>
        <Link to="/"><Button size="lg">Back to Home</Button></Link>
      </div>
    </div>
  );
}
