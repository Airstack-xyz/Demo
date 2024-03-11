import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Path = string | { pathname: string; search?: string };

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (path: Path, _?: { replace: boolean }) => {
      router.push(
        typeof path === "string"
          ? path
          : `${path.pathname}${path.search ? `?${path.search}` : ""}`
      );
    },
    [router]
  );
}
