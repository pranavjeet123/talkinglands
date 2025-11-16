# Talkinglands

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ A modern micro-frontend application built with Nx workspace and module federation ✨.

This workspace contains multiple applications including a shell host app and micro-frontends for maps and insights functionality.

## Project Overview

This project is built using:
- **Nx Workspace** for monorepo management
- **Module Federation** for micro-frontend architecture
- **Tailwind CSS** for styling and responsive design
- **React** for the frontend framework
- **Leaflet.js** for interactive map features

### Applications

- **Shell**: The host application that serves static remotes at build time
- **Maps**: Features interactive maps with heatmap density layers and candidate markers using Leaflet.js
- **Insights**: Data visualization and analytics components
- **Talkinglands**: Main application with routing capabilities

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created.

## Finish your remote caching setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/o0QYtaZJoh)


## Run tasks

### Development Servers

To run the shell application (which serves static remotes at build time):

```sh
npx nx serve shell
```

To run the dev server for the main talkinglands app:

```sh
npx nx serve talkinglands
```

To run the maps micro-frontend:

```sh
npx nx serve maps
```

To run the insights micro-frontend:

```sh
npx nx serve insights
```

### Production Builds

To create a production bundle for any application:

```sh
npx nx build talkinglands
npx nx build shell
npx nx build maps
npx nx build insights
```

### Project Information

To see all available targets to run for a project, run:

```sh
npx nx show project talkinglands
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Features

### Styling
- **Tailwind CSS** is implemented across all applications for consistent styling and responsive design
- Utility-first CSS framework for rapid development

### Maps Application
- Interactive maps powered by **Leaflet.js**
- Heatmap density layers for data visualization
- Candidate markers for location-based information
- Responsive map interface with zoom and pan capabilities

### Architecture
- **Module Federation** for micro-frontend architecture
- Shell application that serves static remotes at build time
- Independent deployment and development of micro-frontends

> **Note**: This README will be updated gradually as the application develops and new features are implemented.

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/react:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Contributors

- **[Pranavjeet Mishra](https://linkedin.com/in/pranavjeet)** - Lead Developer

## Support

For support tickets and inquiries, please contact: [pranavjeet.m@gmail.com](mailto:pranavjeet.m@gmail.com)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
