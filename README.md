# SnackTrack-Server


### :gear:&nbsp;&nbsp;Development Workflow

#### Getting Started
* Make sure you have [Node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install/) installed
* Clone the SnackTrack-Server repo to your local machine
* `yarn install` to get all of the dependency packages
* Spawn a local node server with `yarn run start`
* For developmenet(nodemon), run server with `yarn run dev`

#### Making Changes
1. Create a new feature branch off of the `dev` branch and name it with the number of the Jira ticket you'll be working on (e.g. `SNAK-101`).
2. Make changes and commit your changes to your feature branch with [Conventional Commit Messages](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13) 
3. Once you're satisfied that your changes address the ticket, open a new pull request for your feature branch with the corresponding Jira ticket number and title as the PR title (e.g. SNAK-61: Implement POST/api/v1/payments) 
4. Fill out [PR template](https://github.com/CPSC319-Galvanize/SnackTrack-Server/blob/dev/.github/pull_request_template.md) when you post a PR
5. Resolve all merge conflicts as needed.
6. Assign two other BE team members to review your PR and be open and available to address feedback.
7. Comment the PR link in the Jira ticket.
8. After approval from both team members, confirm the PR and merge your feature branch into the `dev` branch.
9. Confirm that your changes are reflected in the `dev` branch, and then delete your feature branch.

At the end of every sprint (tentatively), we'll do a code freeze and merge the `dev` branch into `main`.

#### Little Things to Note
1. Follow [Conventional Commit Messages](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13) 
2. Use ticket number as branch name. (Ex. SNAK-61)
3. Use ticket number + title as a PR title (Ex. SNAK-61-Implement POST/api/v1/payments)
4. Fill out [PR template](https://github.com/CPSC319-Galvanize/SnackTrack-Server/blob/dev/.github/pull_request_template.md) when you post a PR

#### Branches
| Branch | Description |
|--------|-------------|
| `main` | anything & everything |
| `dev` | experimental development branch |
| `TICKET-NUMBER` | feature, user story, bugs, fixes (e.g. `SNAK-50`) |


#### Reference
More information for [Sequelize](https://sequelize.org/master/index.html)
