const Alert = ({ className, ...props }) => (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${className}`}
      {...props}
    />
  );
  
  const AlertDescription = ({ className, ...props }) => (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
  );
  
  export { Alert, AlertDescription };