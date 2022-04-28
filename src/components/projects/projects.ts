const projects: Project[] = [
  {
    name: "DiscordSRVUtils",
    repo: "BlueDevelopersInc/DiscordSRVUtils",
  },
];
let fullyLoaded = false;

interface Project {
  name: string;
  repo: string;
  links?: {
    name: string;
    url: string;
  };
  data?: {
    description: string;
    longDescription: string;
    latestVersion?: {
      title: string;
      downloadUrl: string;
    };
  };
}

export const Projects = projects;
export const ProjectsFullyLoaded = fullyLoaded;
