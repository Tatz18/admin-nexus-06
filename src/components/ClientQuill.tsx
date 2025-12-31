import { useEffect, useState } from "react";

type QuillComponent = React.ComponentType<any>;

const ClientQuill = (props: any) => {
  const [Quill, setQuill] = useState<QuillComponent | null>(null);

  useEffect(() => {
    let mounted = true;

    import("react-quill").then((mod) => {
      if (mounted) {
        setQuill(() => mod.default);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Quill) {
    return (
      <div className="h-40 flex items-center justify-center border rounded-md text-muted-foreground">
        Loading editor…
      </div>
    );
  }

  return <Quill {...props} />;
};

export default ClientQuill;
