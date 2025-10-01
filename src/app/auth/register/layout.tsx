import "@/app/styles/register.css";
import Script from "next/script";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="body-register">
        {children}
      </div>
    </>
  );
}
