import { usePathname } from 'next/navigation';

export function useMatch(pathName: string) {
  //   const router = useRouter();
  //   return router..includes(pathName);
  const pathname = usePathname();
  console.log('pathname', pathname, pathName);
  return pathname === pathName;
}
