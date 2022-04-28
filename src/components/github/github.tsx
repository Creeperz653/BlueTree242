import React, { useEffect, useState } from "react";
import moment from "moment";
import "./github.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit, faCodeMerge, faCodePullRequest, faComment, faStar,  } from "@fortawesome/free-solid-svg-icons";
import { faGitAlt } from "@fortawesome/free-brands-svg-icons";
export default function GithubActivity() {
  const [activity, setActivity] = useState<Activity[] | null>(null);
  const [error, setError] = useState<Boolean>(false);
  useEffect(() => {
    fetchActivity()
      .then((a) => {
        setActivity(a);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div className={"github-activity"}>
      <h3>
        Activity on <a href="https://github.com/BlueTree242">GitHub</a>:
      </h3>
      {activity == null ? (
        error ? (
          <p>
            <strong>
              Github is weird today, not giving us information, but you can
              check it <a href="https://github.com/BlueTree242">here</a>
            </strong>
          </p>
        ) : (
          <p>
            <strong>Loading...</strong>
          </p>
        )
      ) : (
        activity.map((a) => {
          const content = titles[a.type]?.(a); //get the activity html for the activity
          if (!content) return null; //not found
          return (
            <div>
              <span>
                <FontAwesomeIcon icon={content.icon ? content.icon : faGitAlt} />{" "}
                {moment(a.created_at).fromNow()}, I <b>{content.title}</b>{" "}
                {content.suffix}{" "}
                <a href={`https://github.com/${a.repo.name}`}>{a.repo.name}</a>
              </span>
              <p>{content.body}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

async function fetchActivity(): Promise<Activity[]> {
  return (async () => {
    const activityReq = await fetch(
      `https://api.github.com/users/BlueTree242/events`, //fetch them
      { headers: { accept: "application/vnd.github.v3+json" } }
    );
    return (await activityReq.json())
      .filter((a: Activity) => events.includes(a.type)) //make sure the event is actually supported
      .slice(0, 5)
  })();
}

export const events: ReadonlyArray<string> = [
  "PushEvent",
  "PullRequestEvent",
  "PullRequestReviewEvent",
  "IssuesEvent",
  "CreateEvent",
  "IssueCommentEvent",
] as const; //supported events from github

interface Activity {
  payload: any;
  type: string;
  id: number;
  repo: {
    name: string;
  };
  created_at: string;
}

type ActivityHtml = (activity: Activity) => {
  title: string;
  suffix: string;
  body: React.ReactNode;
  icon?: IconProp;
} | null;

interface Commit {
  sha: string;
  message: string;
}
//these decide how the text looks like
export const titles: { [k: string]: ActivityHtml } = {
  PushEvent: (x) => ({
    title: "pushed",
    suffix: "to",
    icon: faCodeCommit,
    body: x.payload.commits.map((c: Commit) => (
      <span key={c.sha}>
        <a href={commitUrl(x, c)} target={"_blank"}>
          <code>{c.sha.slice(0, 7)}</code>
        </a>
        : {c.message}
      </span>
    )),
  }),
  PullRequestEvent: (activity) =>
    [
      "opened",
      "edited",
      "closed",
      "reopened",
      "assigned",
      "unassigned",
      "created",
    ].includes(activity.payload.action)
      ? {
          title: `${
            activity.payload.action === "closed" &&
            activity.payload.pull_request.merged
              ? "merged"
              : activity.payload.action
          } a pull request`,
          suffix: "in",
          icon: 
              activity.payload.action === "closed" &&
              activity.payload.pull_request.merged ? faCodeMerge : faCodePullRequest
          ,
          body: (
            <span>
              <a href={pullRequestUrl(activity)}>
                #{activity.payload.pull_request.number}:
              </a>{" "}
              {activity.payload.pull_request.title}
            </span>
          ),
        }
      : null,
  PullRequestReviewEvent: (activity) => ({
    ...titles["PullRequestEvent"](activity)!,
    title: "reviewed a pull request",
    icon: faStar
  }),
  IssuesEvent: (activity) => ({
    title: `${activity.payload.action} an issue`,
    suffix: "in",
    body: (
      <span>
        <a href={issueUrl(activity)}>#{activity.payload.issue.number}:</a>{" "}
        {activity.payload.issue.title}
      </span>
    ),
  }),
  CreateEvent: (activity) => ({
    // for example creating new branch
    title: `created a new ${activity.payload.ref_type}`,
    suffix: "in",
    body: activity.payload.ref,
  }),
  IssueCommentEvent: (activity) =>
    activity.payload.action === "created"
      ? {
          ...titles["IssuesEvent"](activity)!,
          title: "commented on an issue",
          icon: faComment
        }
      : null,
};

function commitUrl(activity: Activity, commit: Commit) {
  //gets url for a commit
  return `https://github.com/${activity.repo.name}/commit/${commit.sha}`;
}

function pullRequestUrl(activity: Activity) {
  //gets url for a pull request
  return `https://github.com/${activity.repo.name}/pull/${activity.payload.pull_request.number}`;
}

function issueUrl(activity: Activity) {
  //gets url for an issue
  return `https://github.com/${activity.repo.name}/issues/${activity.payload.issue.number}`;
}
