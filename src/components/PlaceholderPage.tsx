import { useAuth } from "@/contexts/AuthContext";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  const { currentCompany } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="glass-card rounded-xl p-12 text-center">
        <p className="text-muted-foreground text-sm">
          This module is ready for implementation. Connect a backend to enable full functionality.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
