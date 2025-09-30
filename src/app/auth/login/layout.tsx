import "@/app/styles/login.css";
import Script from "next/script";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="body-login">
        {children}
      </div>

      <Script src="/js/login.js" ></Script>
    </>
  );
}
