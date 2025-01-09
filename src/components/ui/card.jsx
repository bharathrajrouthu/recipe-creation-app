const Card = ({ className, ...props }) => (
    <div
      className={`max-w-xl w-full mx-auto my-8 p-6 rounded-lg border bg-white text-gray-900 shadow-lg ${className}`}
      {...props}
    />
  );
  
  const CardHeader = ({ className, ...props }) => (
    <div className={`flex flex-col space-y-2 p-4 ${className}`} {...props} />
  );

  export { Card, CardHeader};