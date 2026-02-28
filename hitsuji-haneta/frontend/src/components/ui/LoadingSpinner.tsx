export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-x-secondary border-t-x-blue" />
    </div>
  );
}
