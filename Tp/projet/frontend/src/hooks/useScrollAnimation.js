import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OPTIONS = { rootMargin: "0px 0px -60px 0px", threshold: 0.1 };

export function useScrollAnimation() {
  const location = useLocation();

  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-on-scroll--visible");
        }
      });
    }, OPTIONS);

    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, [location.pathname]);
}
