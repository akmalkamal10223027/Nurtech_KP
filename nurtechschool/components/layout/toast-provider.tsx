import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <>
      <style>{`
        :root {
          --sonner-toast-bg: #0b0b0b;
          --sonner-toast-border: #1f1f1f;
          --sonner-toast-color: #eaeaea;

          --sonner-radius: 10px;
          --sonner-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }

        [data-sonner-toast] {
          font-family: system-ui, sans-serif;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        [data-sonner-toast][data-type="default"] {
          color: #000000;
        }

        [data-sonner-toast][data-type="success"],
        [data-sonner-toast][data-type="error"] {
          color: #ffffff;
        }

        [data-sonner-toast][data-type="error"] {
          background: #ef4444;
          border-color: #b91c1c;
        }

        [data-sonner-toast][data-type="success"] {
          background: #1e6b4c;
          border-color: #0f2a1f;
        }

        .toast-accent {
          border-left: 4px solid var(--primary);
        }
      `}</style>

      <Toaster
        position="bottom-right"
        duration={4000}
        closeButton
        toastOptions={{
          className: "toast-accent",
        }}
      />
    </>
  );
}
