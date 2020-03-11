// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    googleAnalytics: {
        domain: 'auto', // 'none' for localhost           'auto' when going live
        // trackingId: 'UA-131564755-1' // DEV
        trackingId: 'UA-126994279-1' // PROD
    }
};
// CHECK GOOGLE ANALYTIC ID 131564755 DEV
// CHECK GOOGLE ANALYTIC ID 126994279 PROD
