import pc from 'picocolors';

export function routeMount(method: string, path: string) {
  console.log(
    pc.blue(
      `[${new Date().toLocaleTimeString()}]: Mounted ${method} request on path ${path}`
    )
  );
}
