---
title: PR Submission Guidelines
---

## Preparation
* Before you are ready to submit code to us, please read the [Development Specification](../community/dev-standard.md) and strictly follow the code format specified therein
* Please make sure that there is a corresponding issue for the function you want to fix or enhance. If it is a newly discovered problem or you want to provide a function enhancement that is not in the issue, please create a new issue and set the correct label, and reply under this issue Show that you are working on this issue. For submitting or handling issues, please refer to [Issue Submission and Handling Specifications](../community/issue-standard.md)
* Please set the ```user.name``` and ```user.email``` parameters correctly in git, otherwise your id may not be displayed in the contributor list, refer to the command ```git config -- global user.name "username"```


## Development Process

**1. Prepare the repository**

Go to [ChaosBlade Github Repo](https://github.com/chaosblade-io/chaosblade) fork the repository to your Github account.

Clone to local.
````
git clone https://github.com/{your-github-id}/chaosblade.git
````
Note: The ChaosBlade project is only taken as an example. ChaosBlade divides the project into many different projects according to scenarios and fields. Please correctly pull the project you want to change and ensure that the project can be compiled.

Add ChaosBlade remote repository.
````
git remote add upstream https://github.com/{your-github-id}/chaosblade.git
git remote -v
````

Execute the compile command ```make build``` to ensure that the project can be compiled. Here we recommend that you read the MakeFile file in the project. If you clearly understand which part of the project you want to modify, you can selectively execute only the corresponding part of the project make instructions, for example:
````
make build_with cli os
# If it is a mac system, run
make build_with cli os_darwin
# If you want to compile linux system version selectively, execute:
ARGS="cli os" make build_with_linux
````

**2. Select issue**

* Select the issue you want to modify, reply to it and indicate that you are currently working on this issue, and set a deadline for yourself when replying.
* There will be a member in the community who will be responsible for following up on the issue. You can also contact the member by email to get relevant suggestions, discussions or guidance.

**3. Create a branch**

Switch to the pulled fork branch, pull the latest code, and create this working branch based on this branch

````
git checkout master
git fetch upstream
git rebase upstream/master
git checkout -b issueNo
````

**4. Coding Development**
* Please follow the development specifications of [ChaosBlade](../community/dev-standard.md) during the development process. And complete the corresponding checks before preparing to submit a pull request, test the ChaosBlade commands involved in the work.
* Push the modified code to the branch of the fork library.

**5. Submit PR**

* Initiate a Pull Request to ChaosBlade's master on the homepage of your fork repository, please include the link of the issue you selected earlier in the PR description to associate the issue with this PR submission.
* Next, the commit will be reviewed by the Reviewer responsible for the issue, who may discuss some implementation details and issues with you in a PR. When Reviewer is satisfied with the commit, the commit will be merged into the development branch.
* Finally, congratulations that you have become a ChaosBlade contributor!

After your branch has been merged, you can delete the remote branch (origin/issueNo) and its associated local branch (issueNo)

## Submission rules

**Commit Message**

Commit Message helps Reviewers better understand what the purpose of submitting a PR is. It can also help speed up the code review process. We encourage contributors to use explicit commit messages rather than ambiguous ones. In general, we advocate the following commit message types:

* feat: A new feature
* fix: A bug fix
* docs: Documentation only changes
* style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* refactor: A code change that neither fixes a bug or adds a feature
* perf: A code change that improves performance
* test: Adding missing or correcting existing tests
* chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

We discourage developers from submitting Commit Messages similar to the following:
* fix bugs
* update
* add doc

**Commit Content**

Commits represent all content changes contained in one commit. We prefer to include content in one submission that can support a full review by Reviewer without the help of any other submissions. In other words, content in one commit can go through CI to avoid code clutter. In short, we need to remember a small rule:
* Try to split the design as finely as possible; make small changes and submit multiple times, but the integrity of the submission should be guaranteed.


## other

Developers should follow the behaviors of community contributors. For details, see [CONTRIBUTOR COVENANT CODE OF CONDUCT](https://github.com/chaosblade-io/chaosblade/blob/master/CODE_OF_CONDUCT.md)

**Sign your commit**

Please add your signature to the end of your submission, which will certify that you wrote the patch and have the right to pass it as an open source patch.

````
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
660 York Street, Suite 102,
San Francisco, CA 94110 USA

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
````

You need to add at the end of each Commit Message
````
Signed-off-by: Joe Smith <joe.smith@email.com>
````

Please use your real name (sorry, anonymous or pseudonymous contributions are not accepted at this time)

If you set ```user.name``` and ```user.email``` in the git parameters, you can sign directly through ```git commit -s```, ```-s` ``The parameter will automatically add the signature line to the end of the Commit Message
