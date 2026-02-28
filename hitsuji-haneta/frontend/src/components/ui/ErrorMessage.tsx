export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 text-center text-red-500">
      <p>{message}</p>
    </div>
  );
}
