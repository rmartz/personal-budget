export interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
