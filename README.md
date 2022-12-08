# 🔭 maxouxax.me

maxouxax.me is my personal website using the [VueJS ecosystem](https://vuejs.org/) and [Cloudflare Pages](https://pages.cloudflare.com/)

## Project setup

If you want to contribute, you will first need to clone this repository and run the following command.

```bash
npm install
```

## Serving the website locally for development

The following command will serve the website locally, automatically open your browser and leverage the power of VueJS and Cloudflare Pages (especially Cloudflare Pages Functions)

Please note the following command does not work on PowerShell due to argument parsing problems.
```bash
wrangler pages dev --proxy 8080 -- npm run serve
```

### General guidelines when contributing

- First, you of course need to fork the repository, then clone that forked repository on your local machine.

- Before you start coding anything, make sure to create a new branch for your changes.

  💢 Please name your branch after the following pattern:

  - `feature/<feature-name>` - If you are adding a new feature
  - `fix/<issue-number>` - If you are fixing an existing issue

- Once you successfully tested your changes, you can push your changes to the remote repository and create a pull request describing your changes clearly.
