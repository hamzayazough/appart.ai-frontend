declare const process: {
  env: { MAPS_API_KEY: string };
};
export const accessToken = process.env.MAPS_API_KEY;
