import gradient from 'gradient-string';

export function routeMount(method: string, path: string) {
  console.log(
    gradient.summer(
      `[${new Date().toLocaleTimeString()}]: Mounted ${method} request on path ${path}`
    )
  );
}
