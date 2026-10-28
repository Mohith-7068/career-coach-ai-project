// Simplified app-params — no Base44 dependency.
// Auth and data are handled locally via localStorage.
export const appParams = {
    appId: 'career-coach-local',
    token: null,
    functionsVersion: null,
    appBaseUrl: null,
    fromUrl: typeof window !== 'undefined' ? window.location.href : '/'
};
