FROM gitpod/workspace-full:latest

USER gitpod
RUN bash -c 'nvm install v17'
RUN brew install pnpm@7
