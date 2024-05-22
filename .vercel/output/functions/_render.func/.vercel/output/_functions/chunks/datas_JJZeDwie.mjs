export { renderers } from '../renderers.mjs';

const page = () => import('./pages/datas_CMGKRAUF.mjs').then(n => n.d);

export { page };
